create or replace package body adk$event_bus_connector is

  subtype
    t_http_header is varchar2(2048);
  subtype
    t_http_body is varchar2(32000);
    
  type
    t_secret_data is record
    (
      algorithm varchar2(20)
      , mode_data varchar2(20)
      , padding varchar2(20)
      , key varchar2(512)
      , iv varchar2(512)
    );
  type
    t_secret_info is record
    (
      data t_secret_data
      , key raw(512)
      , iv raw(512)
    );

  type
    t_token_data is record
    (
      token t_token_string
      , expires_in integer
    );

  type
    t_token_info is record
    (
      data t_token_data
      , token_json t_token_string
      , expire_date timestamp with local time zone
      , expire_date_utc timestamp with time zone
      , expire_date_local timestamp
    );
    
  -- Возвращает информацию о сервисе
  function service_info(pservice_name t_service_name) return t_service_info is
    xservice_info t_service_info;
  begin
    --? Сделать загрузку из настроек на основе pservice_name
    xservice_info.name := pservice_name;
    xservice_info.url := 'http://webtest.aquilon.ru:808';
    xservice_info.transfer_timeout := 30;

    return xservice_info;
  end;
  
  -- Выполняет http post запрос и возвращает ответ
  function http_request(purl t_url, pbody t_http_body) return t_http_body is
    
    xreq utl_http.req;
    xresp utl_http.resp;
    xurl t_url;
    xlength integer;
    xresp_body t_http_body;
    xheader t_http_header;
  begin
    xreq := utl_http.begin_request(url => purl, method => 'POST', http_version => utl_http.http_version_1_1);
    xlength := length(convert(pbody, 'UTF8'));
    
    utl_http.set_header(xreq, 'Content-Type', 'application/x-www-form-urlencoded');
    utl_http.set_header(xreq, 'Content-Length', xlength);

    utl_http.set_body_charset(xreq, 'UTF8');
    utl_http.write_text(xreq, pbody);

    xresp := utl_http.get_response(xreq);
    begin
      utl_http.read_text(xresp, xresp_body);
      begin
        utl_http.get_header_by_name(xresp, 'Content-Type', xheader);
      exception
        when others then
          xheader := null;
      end;
      utl_http.end_response(xresp);
    exception
      when others then
        utl_http.end_response(xresp);
        raise;
    end;
    
    if xresp.status_code <> utl_http.http_ok then
      if upper(xheader) = 'APPLICATION/JSON' then
        raise_application_error(
          -20000
          , 'Ошибка при выполнении http запроса. URL: ' || xurl || '.' ||
            ' Код: ' || xresp.status_code || 
            ' Причина: ' || xresp.reason_phrase ||
            ' Детали: ' || xresp_body);
      else
        raise_application_error(
          -20000
          , 'Ошибка при выполнении http запроса. URL: ' || xurl || '.' ||
            ' Код: ' || xresp.status_code || ' Причина: ' || xresp.reason_phrase);
      end if;
    end if;
    
    return xresp_body;
  end;
  
  -- 1 этап авторизации
  procedure secret_get(puser_name varchar2, purl t_url, psecret_info in out nocopy t_secret_info) is

  cursor cjson(pjson varchar2) is
    with
      data as
      (select pjson as data from dual)
    select
      json_value(d.data, '$.algorithm') as algorithm
      , json_value(d.data, '$.mode') as mode_data
      , json_value(d.data, '$.padding') as padding
      , json_value(d.data, '$.key') as key
      , json_value(d.data, '$.iv') as iv
    from
      data d;

    xurl t_url;
    xreq_body t_http_body;
    xresp_body t_http_body;
  begin
    xurl := purl || '/secret';
    
    xreq_body := 'username=' || puser_name;
    xresp_body := http_request(xurl, xreq_body);
    
    open cjson(xresp_body);
    fetch cjson into psecret_info.data;
    close cjson;
    
    psecret_info.key := utl_i18n.string_to_raw(psecret_info.data.key, 'AL32UTF8');
    psecret_info.key := utl_encode.base64_decode(psecret_info.key);

    psecret_info.iv := utl_i18n.string_to_raw(psecret_info.data.iv, 'AL32UTF8');
    psecret_info.iv := utl_encode.base64_decode(psecret_info.iv);

  end;

  -- 2 этап авторизации
  procedure token_get(
    puser_name varchar2, ppassword varchar2, purl t_url, psecret_info t_secret_info
    , ptoken_info in out nocopy t_token_info) is
    
  cursor ctoken_json(pjson varchar2) is
    with
      data as
      (select pjson as data from dual)
    select
      json_value(d.data, '$.access_token') as access_token
      , json_value(d.data, '$.expires_in') as expires_in
    from
      data d;

  cursor cexpire_date_json(pjson varchar2) is
    with
      data as
      (select pjson as data from dual)
    select
      json_value(d.data, '$.exp') as exp
    from
      data d;

    xurl t_url;
    xreq_body t_http_body;
    xresp_body t_http_body;

    xpassword_raw raw(2048);
    xpassword varchar2(2048);
    
    xpos_start integer;
    xpos_end integer;
    xtoken_json varchar2(4096);
    xexpire_date_1970_seconds integer;
  begin
    xurl := purl || '/token';

    xpassword_raw := utl_i18n.string_to_raw(ppassword, 'AL32UTF8');
    
    xpassword_raw := dbms_crypto.encrypt(
      src => xpassword_raw
      , typ => dbms_crypto.encrypt_aes + dbms_crypto.chain_cbc + dbms_crypto.pad_zero
      , key => psecret_info.key
      , iv => psecret_info.iv);
      
    xpassword_raw := utl_encode.base64_encode(xpassword_raw);
    xpassword := utl_raw.cast_to_varchar2(xpassword_raw);
    
    xreq_body :=
      'username=' || puser_name
      || '&password=' || xpassword
      || '&key=' || psecret_info.data.key;

    ptoken_info.expire_date_local := systimestamp;
    xresp_body := http_request(xurl, xreq_body);

    open ctoken_json(xresp_body);
    fetch ctoken_json into ptoken_info.data;
    close ctoken_json;
    
    ptoken_info.expire_date_local := ptoken_info.expire_date_local + 
      numtodsinterval(ptoken_info.data.expires_in, 'second');
    
    -- Token разделен на 3 части символом '.', нам нужна 2-я часть
    xpos_start := instr(ptoken_info.data.token, '.', 1, 1);
    xpos_end := instr(ptoken_info.data.token, '.', 1, 2);
    xtoken_json := substr(ptoken_info.data.token, xpos_start + 1, xpos_end - xpos_start - 1);
    
    ptoken_info.token_json :=
      utl_i18n.raw_to_char(
        utl_encode.base64_decode(
          utl_i18n.string_to_raw(xtoken_json)
        )
      );
    
    open cexpire_date_json(ptoken_info.token_json);
    fetch cexpire_date_json into xexpire_date_1970_seconds;
    close cexpire_date_json;
    
    ptoken_info.expire_date_utc := 
      from_tz(
        to_date('1970.01.01', 'YYYY.MM.DD') + numtodsinterval(xexpire_date_1970_seconds, 'second')
        , 'UTC');
    ptoken_info.expire_date := ptoken_info.expire_date_utc;
  end;

  -- Устанавливает соединение с сервисом и возвращает token
  procedure service_login(pservice_name t_service_name, puser_name varchar2, ppassword varchar2, ptoken out t_token) is
    xservice_info t_service_info;
    xsecret_info t_secret_info;
    xtoken_info t_token_info;
  begin
    xservice_info := service_info(pservice_name);

    utl_http.set_transfer_timeout(xservice_info.transfer_timeout);

    -- 1 Этап: аутентификация
    secret_get(puser_name, xservice_info.url, xsecret_info);
    -- 2 Этап: авторизация
    token_get(puser_name, ppassword, xservice_info.url, xsecret_info, xtoken_info);
    
    ptoken.token_string := xtoken_info.data.token;
    ptoken.expires_in := xtoken_info.data.expires_in;
    ptoken.expire_date_time := xtoken_info.expire_date_local;
  end;

  -- Проверяет время жизни token
  function token_is_expired(ptoken t_token) return boolean is
  begin
    return ptoken.expire_date_time >= systimestamp;
  end;

begin
  null;
end;
/

create or replace package adk$event_bus_connector is
  
  subtype
    t_url is varchar2(4096);
  subtype
    t_token_string is varchar2(4096);
  subtype
    t_service_name is varchar2(4096);
  -- ���������� � �������
  type
    t_service_info is record
    (
      name t_service_name
      , url t_url
      , transfer_timeout integer
    );
  -- Token ���������� � ��������, ��������� ��������� �����
  type
    t_token is record
    (
      token_string t_token_string
      , expires_in integer
      , expire_date_time timestamp
    );
    
  -- ���������� ���������� � �������
  function service_info(pservice_name t_service_name) return t_service_info;

  -- ������������� ���������� � �������� � ���������� token
  procedure service_login(pservice_name t_service_name, puser_name varchar2, ppassword varchar2, ptoken out t_token);
  
  -- ��������� ����� ����� token
  function token_is_expired(ptoken t_token) return boolean;

end;
/

CREATE OR REPLACE FUNCTION adk_group_objects.group_delete_by_id (
  pid adk_core.object_id
)
RETURNS void AS
$body$
declare
  xgroup adk_group_objects.groups%rowtype;
  xerror_text adk_core.error.text%type;
  xaction_name varchar;
begin
  xaction_name := 'Удаление';
  -- Проверка параметров
  if adk_core.object_id_is_empty(pid) then
    perform adk_group_objects.group_error_raise(
      paction_name => xaction_name
      , pdetail => 'Не указан id группы.'
      , phint => 'Обратитесь к администратору системы.');
  end if;
  -- Проверка существования группы
  xgroup := adk_group_objects.group_by_id(pid => pid);
  if adk_core.object_id_is_empty(xgroup.id) then
    perform adk_group_objects.group_error_raise(
      paction_name => xaction_name
      , detail = format('Группа с id "%s" не найдена.', pid)
      , hint = 'Обратитесь к администратору системы');
  end if;
  -- Сохранение
  begin
    delete from adk_group_objects.group_objects where object_id = pid;
    delete from adk_group_objects.groups where id = pid;
  exception
    when others then
      perform adk_group_objects.group_error_raise(
        paction_name => xaction_name
        , detail = 'Системная ошибка: ' || sqlerrm
        , hint = 'Обратитесь к администратору системы');
  end;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

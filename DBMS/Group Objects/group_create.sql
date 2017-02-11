CREATE OR REPLACE FUNCTION adk_group_objects.group_create (
  pparent_group_id adk_core.object_id,
  inout pgroup adk_group_objects.groups
)
RETURNS adk_group_objects.groups AS
$body$
declare
  xgroup adk_group_objects.groups%rowtype;
  xaction_name varchar;
begin
  xaction_name := 'Создание';
  -- Проверка уникальности
  if not adk_core.object_id_is_empty(pparent_group_id) then
    xgroup := adk_group_objects.group_by_name(pgroup.name, pparent_group_id);
    if not adk_core.object_id_is_empty(xgroup.id) then
      perform adk_group_objects.group_error_raise(
        paction_name => xaction_name
        , pdetail => format('Группа с именем "%s" уже существует.', xgroup.name)
        , phint => 'Укажите другое наименование группы.');
    end if;
  end if;
  -- Сохранение
  begin
    if not adk_core.object_id_is_empty(pgroup.id) then
      insert into adk_group_objects.groups
        (id, name, description)
        values (pgroup.id, pgroup.name, pgroup.description);
    else
      insert into adk_group_objects.groups
        (name, description)
        values (pgroup.name, pgroup.description)
        returning id into pgroup.id;
    end if;
    -- Добавление в группу
    if not adk_core.object_id_is_empty(pparent_group_id) then
      perform adk_group_objects.group_object_add(pparent_group_id, pgroup.id);
    end if;

  exception
    when others then
      perform adk_group_objects.group_error_raise(
        paction_name => xaction_name
        , pdetail => 'Системная ошибка: ' || sqlerrm
        , phint => 'Обратитесь к администратору системы.');
  end;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

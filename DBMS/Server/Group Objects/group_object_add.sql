CREATE OR REPLACE FUNCTION adk_group_objects.group_object_add (
  pgroup_id adk_core.object_id,
  pobject_id adk_core.object_id
)
RETURNS void AS
$body$
declare
  xobject_type_id adk_core.object_type_id;
  xgroup adk_group_objects.groups%rowtype;
  xaction_name varchar;
begin
  xaction_name := 'Добавление объекта в группу';
  -- Проверка параметров
  if adk_core.object_id_is_empty(pgroup_id) then
    perform adk_group_objects.group_error_raise(
      paction_name => xaction_name
      , pdetail => 'Не указан родительский объект.'
      , phint => 'Обратитесь к администратору системы.');
  end if;
  if adk_core.object_id_is_empty(pobject_id) then
    perform adk_group_objects.group_error_raise(
      paction_name => xaction_name
      , pdetail => 'Не указан подчиненный объект.'
      , phint => 'Обратитесь к администратору системы.');
  end if;
  xobject_type_id := adk_core.object_id_to_type_id(pobject_id);
  -- Проверка на уникальность группы
  if xobject_type_id = adk_group_objects.group_type_id() then
    xgroup := adk_group_objects.group_by_id(pobject_id);
    xgroup := adk_group_objects.group_by_name(xgroup.name, pgroup_id);
    if not adk_core.object_id_is_empty(xgroup.id) then
      perform adk_group_objects.group_error_raise(
        paction_name => xaction_name
        , pdetail => 'Группа с таким именем уже существует в родителькой группе.'
        , phint => 'Смените наименование группы и повторите операцию.');
    end if;
  end if;
  -- Сохранение
  begin
    insert into adk_group_objects.group_objects
      (group_id, object_id)
      values (pgroup_id, pobject_id);
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

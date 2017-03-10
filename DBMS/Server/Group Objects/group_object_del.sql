CREATE OR REPLACE FUNCTION adk_group_objects.group_object_del (
  pgroup_id adk_core.object_id,
  pobject_id adk_core.object_id
)
RETURNS void AS
$body$
declare
  cgroups_count cursor (pobject_id adk_core.object_id) for
    select
      count(go.group_id) as xcount
    from
      adk_group_objects.group_objects as go
    where
      go.object_id = pobject_id;

  xobject_type_id adk_core.object_type_id;
  xgroup adk_group_objects.groups%rowtype;
  xaction_name varchar;
  xcount integer;
begin
  xaction_name := 'Удаление объекта из группы';
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
  -- Проврека количества родительских групп
  open cgroups_count(pobject_id);
  fetch cgroups_count into xcount;
  close cgroups_count;
  if coalesce(xcount, 0) < 2 then
    perform adk_group_objects.group_error_raise(
      paction_name => xaction_name
      , pdetail => 'Нельзя исключить указанный объект из последней гуппы.'
      , phint => 'Обратитесь к администратору системы.');
  end if;
  -- Сохранение
  begin
    delete from adk_group_objects.group_objects
      where
        group_id = pgroup_id
        and object_id = pobject_id;
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

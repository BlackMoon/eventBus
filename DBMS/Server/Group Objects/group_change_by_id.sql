CREATE OR REPLACE FUNCTION adk_group_objects.group_change_by_id (
  inout pgroup adk_group_objects.groups
)
RETURNS adk_group_objects.groups AS
$body$
declare
  cgroup_by_name_in_parents cursor (pname varchar, pchild_group_id adk_core.object_id) for
    select
      g.*
    from
      adk_group_objects.group_objects as pg
      , adk_group_objects.group_objects as cg
      , adk_group_objects.groups as g
    where
      pg.object_id = pchild_group_id
      and cg.group_id = pg.group_id
      and cg.object_id <> pchild_group_id
      and g.id = cg.object_id
      and upper(g.name) = upper(pname);

  xgroup adk_group_objects.groups%rowtype;
  xerror_text adk_core.error.text%type;
  xaction_name varchar;
begin
  xaction_name := 'Изменение';
  -- Проверка существования
  xgroup := adk_group_objects.group_by_id(pgroup.id);
  if adk_core.object_id_is_empty(xgroup.id) then
    perform adk_group_objects.group_error_raise(
      paction_name => xaction_name
      , pdetail => format('Группа с id "%s" не найдена.', pgroup.id)
      , phint => 'Обратитесь к администратору системы.');
  end if;
  -- Проверка уникальности по имени в группах
  for xparent_id in cgroup_by_name_in_parents(pgroup.name, pgroup.id) loop
    perform adk_group_objects.group_error_raise(
      paction_name => xaction_name
      , pdetail => 'Группа с с таким именем уже существует.'
      , phint => 'Измените наименование.');
  end loop;
  -- Изменение
  begin
    if xgroup <> pgroup then
      update adk_group_objects.groups
        set name = pgroup.name, description = pgroup.description
        where id = pgroup.id;
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

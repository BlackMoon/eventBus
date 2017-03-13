CREATE OR REPLACE FUNCTION adk_group_objects.group_by_name (
  pname varchar,
  pparent_group_id adk_core.object_id
)
RETURNS adk_group_objects.groups AS
$body$
declare
  cgroup_by_name cursor (pname varchar, pparent_group_id adk_core.object_id) for
    select
      g.*
    from
      adk_group_objects.group_objects as go
      , adk_group_objects.groups as g
    where
      go.group_id = pparent_group_id
      and g.id = go.object_id
      and upper(g.name) = upper(pname);
  xgroup adk_group_objects.groups%rowtype;
begin
  open cgroup_by_name(pname, pparent_group_id);
  fetch cgroup_by_name into xgroup;
  close cgroup_by_name;

  return xgroup;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

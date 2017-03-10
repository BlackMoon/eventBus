CREATE OR REPLACE FUNCTION adk_group_objects.group_by_id (
  pid adk_core.object_id
)
RETURNS adk_group_objects.groups AS
$body$
declare
  cgroup_by_id cursor (pid adk_core.object_id) for
    select
      g.*
    from
      adk_group_objects.groups as g
    where
      g.id = pid;
  xgroup adk_group_objects.groups%rowtype;
begin
  open cgroup_by_id(pid);
  fetch cgroup_by_id into xgroup;
  close cgroup_by_id;

  return xgroup;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

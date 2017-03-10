CREATE OR REPLACE FUNCTION adk_core.object_id_to_local_id (
  pobject_id adk_core.object_id
)
RETURNS adk_core.object_local_id AS
$body$
declare
  xlocal_id adk_core.object_local_id;
begin
  xlocal_id := substring(pobject_id, 7)::adk_core.object_local_id;
  return xlocal_id;
end;
$body$
LANGUAGE 'plpgsql'
IMMUTABLE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

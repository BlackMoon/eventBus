CREATE OR REPLACE FUNCTION adk_group_objects.group_type_id (
)
RETURNS adk_core.object_type_id AS
$body$
declare
begin
  return 10;
end;
$body$
LANGUAGE 'plpgsql'
IMMUTABLE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

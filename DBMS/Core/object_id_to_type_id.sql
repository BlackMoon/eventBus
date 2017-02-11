CREATE OR REPLACE FUNCTION adk_core.object_id_to_type_id (
  pobject_id adk_core.object_id
)
RETURNS adk_core.object_type_id AS
$body$
declare
  xtype_id adk_core.object_type_id;
begin
  xtype_id := substring(pobject_id, 1, 5)::adk_core.object_type_id;
  return xtype_id;
end;
$body$
LANGUAGE 'plpgsql'
IMMUTABLE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

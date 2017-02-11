CREATE OR REPLACE FUNCTION adk_core.object_id_make (
  pobject_type_id adk_core.object_type_id,
  pobject_local_id adk_core.object_local_id
)
RETURNS adk_core.object_id AS
$body$
declare
  xobject_id adk_core.object_id;
begin
  xobject_id :=
    lpad(pobject_type_id::varchar, 5, '0')
    || ':'
    || lpad(pobject_local_id::varchar, 15, '0');
  return xobject_id;
end;
$body$
LANGUAGE 'plpgsql'
IMMUTABLE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

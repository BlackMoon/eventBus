CREATE OR REPLACE FUNCTION adk_application.application_type_id (
)
RETURNS adk_core.object_type_id AS
$body$
declare
begin
  return 1000;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

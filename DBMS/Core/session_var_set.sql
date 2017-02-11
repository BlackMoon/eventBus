CREATE OR REPLACE FUNCTION adk_core.session_var_set (
  pdomain varchar,
  pname varchar,
  pvalue pg_catalog.anyelement
)
RETURNS text AS
$body$
declare

begin
  return set_config('adk.' || pdomain || '.' || pname, pvalue::text, false);
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

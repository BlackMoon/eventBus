CREATE OR REPLACE FUNCTION adk_group_objects.group_error_raise (
  paction_name varchar,
  pdetail varchar,
  phint varchar
)
RETURNS void AS
$body$
declare
  xobject_type_name varchar;
  xmessage varchar;
begin
  xobject_type_name := 'Группа';
  xmessage :=
    'Ошибка при выполнении: '
    || xobject_type_name
    || ' -> '
    || paction_name || '.';
  perform adk_core.error_raise(
    pcode => '20001'::varchar
    , pmessage => xmessage
    , pdetail => pdetail
    , phint => phint);
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

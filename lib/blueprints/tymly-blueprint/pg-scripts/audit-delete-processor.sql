CREATE OR REPLACE FUNCTION tymly.delete_processor()
  RETURNS trigger AS
$BODY$
DECLARE
  model_name TEXT = TG_ARGV[0];
  primary_key_columns TEXT ARRAY = TG_ARGV[1];
  key_fields TEXT ARRAY;
  key_field TEXT;
  old_json JSON;
  diff JSONB = jsonb_object('{ "action", "delete" }');
BEGIN
  old_json = to_json(old);

  FOREACH key_field IN ARRAY primary_key_columns LOOP
  	key_fields := array_append(key_fields, json_extract_path_text(old_json, key_field));
  END LOOP;

  INSERT INTO tymly.rewind (
    model_name,
    key_string,
    old_values,
    diff,
    _modified_by
  ) VALUES (
    model_name,
    array_to_string(key_fields, '_', 'XXX'),
    old_json,
    diff,
    json_extract_path_text(old_json, '_modified_by')
  );

  RETURN old;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

CREATE OR REPLACE FUNCTION tymly.insert_processor()
  RETURNS trigger AS
$BODY$
DECLARE
  model_name TEXT = TG_ARGV[0];
  primary_key_columns TEXT ARRAY = TG_ARGV[1];
  key_fields TEXT ARRAY;
  key_field TEXT;
  new_json JSON;
  diff JSONB = jsonb_object('{ "action", "insert" }');
BEGIN
  new_json = to_json(new);

  FOREACH key_field IN ARRAY primary_key_columns LOOP
  	key_fields := array_append(key_fields, json_extract_path_text(new_json, key_field));
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
    new_json,
    diff,
    json_extract_path_text(new_json, '_modified_by')
  );

  RETURN new;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

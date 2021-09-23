DROP TABLE IF EXISTS bins;
DROP TABLE IF EXISTS request_data;

CREATE TABLE bins (
  id serial PRIMARY KEY,
  url text NOT NULL UNIQUE,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  quantity_requests integer DEFAULT 0 NOT NULL
);

CREATE TABLE request_data (
  id serial PRIMARY KEY,
  bin_id integer NOT NULL,   
  header_content json,
  body json,
  method text NOT NULL,
  received_at timestamp NOT NULL DEFAULT current_timestamp,
  sender_ip text NOT NULL,  
  FOREIGN KEY (bin_id) REFERENCES bins (id) ON DELETE CASCADE
);

CREATE INDEX ON request_data(bin_id);

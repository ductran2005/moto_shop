-- ============================================================
-- SpeedZone – Disable email confirmation for development
-- ============================================================

-- Allow immediate login after signup (no email verification needed)
update auth.config
set value = 'false'
where name = 'mailer_autoconfirm'
  and value = 'true';

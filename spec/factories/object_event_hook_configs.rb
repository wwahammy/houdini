# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
FactoryBot.define do
  factory :open_fn_config, class: ObjectEventHookConfig do
    webhook_service { :open_fn }
    configuration { { 'x-api-key': 'my-secret-key' } }
    object_event_types { ['supporter.update'] }
    inbox { 'https://www.openfn.org/inbox/my-inbox-id' }
  end
end

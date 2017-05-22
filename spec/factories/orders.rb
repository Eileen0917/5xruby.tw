# frozen_string_literal: true

FactoryGirl.define do
  factory :order do
    activitiable { create(%i[talk camp].sample) }
    amount { Faker::Number.between(10000, 20000) }
    fields { "" }
    user { create(:user) }
  end
end
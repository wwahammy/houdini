class ETapImportContact < ActiveRecord::Base
  attr_accessible :supporter, :row
  belongs_to :e_tap_import

  scope :processed, -> { supporter.exists?}
  scope :not_processed, -> {!supporter.exists?}

  def self.find_by_account_id(account_id)
    where("row @> '{\"Account Number\": \"#{account_id}\"}'").first

    #where("row ->> ? = ?", 'Account Number', account_id).first
  end

  def create_or_update_CUSTOM(known_supporter=nil)
    
    # address_keys = ['name', 'address', 'city', 'country', 'state_code']
    # custom_fields = data['customFields']
    # tags = data['tags']
    # data = HashWithIndifferentAccess.new(Format::RemoveDiacritics.from_hash(data, address_keys))
    #   .except(:customFields, :tags)
    got_supporter_via_address = false
    latest_journal_entry = journal_entries.first
  
    supporter = known_supporter ||
        e_tap_import.nonprofit.supporters.not_merged.includes(:custom_field_joins => :custom_field_master).where('custom_field_masters.name = ? AND custom_field_joins.value = ?', "E-Tapestry Id #", self.id.to_s).references(:custom_field_masters, :custom_field_joins).first ||
        e_tap_import.nonprofit.supporters.not_merged.where('name = ? AND email = ?', self.name, self.email).first

    unless supporter
      supporter = e_tap_import.nonprofit.supporters.not_merged.where('name = ? AND address = ? AND state_code = ? AND city = ?',self.name,self.address,self.state, self.city).first 
      if supporter.present?
        got_supporter_via_address = true
      end
    end
  
    # is this also relate to the latest payment
    if supporter
      if (latest_journal_entry&.to_wrapper&.date || Time.at(0)) >= (supporter.payments.order('date DESC').first&.date || Time.at(0)) #
        puts "update the supporter info"
        begin
          supporter.update(self.to_supporter_args)
        rescue PG::NotNullViolation => e
          byebug
          raise e
        end
      else
        puts "do nothing!"
      end
    else
      supporter = e_tap_import.nonprofit.supporters.create(self.to_supporter_args)
    end
  
    InsertCustomFieldJoins.find_or_create(e_tap_import.nonprofit.id, [supporter.id],  self.to_custom_fields) if self.to_custom_fields.any?
    supporter
  end

  def journal_entries
    e_tap_import.e_tap_import_journal_entries.find_all_by_contact(self)
  end

  def name
    row['Account Name'] || ""
  end

  def account_id
    row['Account Number']
  end

  def organization
    row['Company']
  end

  def address
    row['Parsed Address'] || ""
 end
 
 def city

   row['Parsed City'] || ""

 end

 def zip_code
   row['Parsed ZIP Code'] || ""
 end

 def state
   row['Parsed State'] || ""
 end
 
 def country
   row['Parsed Country'] || ""
 end

  

  def email
    if emails.count > 0
      emails[0]
    else
      nil
    end
  end


  def email_address2
    if emails.count > 1
      emails[1]
    else
      nil
    end;
  end

  def email_address3
    if emails.count > 2
      emails[2]
    else
      nil
    end
  end

  def full_address
    row['Full Address with Country (Single Line)'] || ""
  end

  def church_parish
    row['County']
  end

  def created_at
    row['Created At']
  end

  def created_by
    row['Created By']
  end

  def envelope_salutation
    row["Envelope Salutation"]
  end

  def supporter_phone
    if phone_numbers.count > 0
      phone_numbers[0]
    else
      nil
    end
  end

  def supporter_phone_2
    if phone_numbers.count > 1
      phone_numbers[1]
    else
      nil
    end
  end

  def supporter_phone_3
    if phone_numbers.count > 2
      phone_numbers[2]
    else
      nil
    end
  end

  def to_supporter_args
    supporter_args = {
      email: email,
      name: name,
      organization: organization
    }

    unless supporter_phone.nil?
      supporter_args = supporter_args.merge(phone: supporter_phone)
    end

    supporter_args
  end

  def to_custom_fields
    custom_fields = [['E-Tapestry Id #', id]]
    if supporter_phone_2
      custom_fields += [['Supporter Phone 2', supporter_phone_2]]
    end

    if supporter_phone_3
      custom_fields += [['Supporter Phone 3', supporter_phone_3]]
    end
    
    if email_address2
      custom_fields += [['Email Address 2', email_address2]]
    end

    if email_address3
      custom_fields += [['Email Address 3', email_address3]]
    end

    if church_parish
      custom_fields += [['Church Parish', church_parish]]
    end

    if  envelope_salutation
      custom_fields += [['Envelope Salutation', envelope_salutation]]
    end

    if created_at
      custom_fields += [['Created At', created_at]]
    end
    
    if created_by
      custom_fields += [['Created By', created_by]]
    end

    custom_fields
  end

  private

  def phone_numbers
    [row["Phone - Voice"], row['Phone - Mobile'], row['Phone - Cell']].select{|i| i.present?}
  end

  def emails
    [row['Email Address 1'], row['Email Address 2'], row['Email Address 3']].select{|i| i.present?}
  end
end

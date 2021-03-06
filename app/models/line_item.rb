# id is generated by SecureRandom as each instance will persist only in the session object
class LineItem
  require 'securerandom'
  attr_reader :type, :product_id, :quantity, :interval, :name, :price, :id
  
  def initialize(params)
    @type = params[:type]
    @product_id = params[:product_id]
    @quantity = params[:quantity] ? params[:quantity] : 1
    @interval = params[:interval]
    @name = params[:name]
    @price = params[:price]
    @id = SecureRandom.uuid
  end
end
Table service{
   id integer
   title string
   description string
   img_url string
   rating string
   status varchar
   createdAt timestamp
   updatedAt timestamp  
}

Table service_category{
   id integer
   service_id integer
   name string
   createdAt timestamp
   updatedAt timestamp  
}

Table service_category_items{
   id integer
   service_category_id integer
   name string
   img_url string
   price integer
   quantity integer
   description string
   createdAt timestamp
   updatedAt timestamp  
}

Table user{
   id integer
   address  string
   phone_number integer
   name string
   email string 
   password string
   img_url string
   role_id integer
}

Table Order{
  id integer
  quick_service string
  user_id integer [ref :<> user.id]
  service_id integer [ref :<>service.id]
  order_date datetime
  pickup_date datetime
  dellivery_date datetime
  status string
  total_price integer
}
Table support_contact_us{
  id integer
  user_id integer
  title string
  description string
  status string
}
Table support_ticket {
   id integer [primary key]
   user_id integer [ref:< users.id]
   order_id integer
   subject varchar 
   message varchar
   status ennum //enum, "open", "closed"
   createdAt timestamp
   updatedAt timestamp
 }
 Table carts {
  id integer [primary key]
  user_id integer  [ref:< users.id]
  product_id integer [ref:< products.id]
  quantity integer
  createdAt timestamp
  updatedAt timestamp
}
Table cloathsItem{
  id integer
  order_id integer 
  category_id integer 
  quantity string
  special_instruction string
}
Table payment{
   id integer
   order_id integer 
   payment_method string
   transation_id string 
   payment_status string
}
Table Address{
  id integer
  user_id integer 
  state string
  city string
  pincode string
  phone_number integer
  house_no string
  road_name string
  nearbyFamouseShopMall string
}

Table user_address {
  id integer [primary key]
  user_id integer [ref:< products.id]
  address_line1 varchar
  address_line2 varchar
  house_no string
  city varchar
  state varchar
  pincode varchar
  country varchar
  createdAt timestamp
  updatedAt timestamp
}

Table orders {
  id integer [primary key]
  user_id integer  [ref:< users.id]
  billing_address_id integer [ref:< billing_address.id]
  total_amount varchar
  shipping_address integer
  payment_method varchar
  status varchar
  createdAt timestamp
  updatedAt timestamp
}

Table orders_items {
  id integer [primary key]
  product_id integer [ref:< products.id]
  order_id integer [ref:< orders.id]
  variant_id integer [ref:< product_variant.id]
  quantity integer
  createdAt timestamp
  updatedAt timestamp
}
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')

const mongoose = require('mongoose')

AdminBro.registerAdapter(AdminBroMongoose)

const express = require('express')
const app = express()

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
})

const ADMIN = {
    email: process.env.ADMIN_EMAIL || 'ahmetsakalli@secondHand.com',
    password: process.env.ADMIN_PASSWORD || '12345'
}


  const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    cookieName: process.env.ADMIN_COOKIE_NAME || 'admin-bro',
    cookiePassword: process.env.ADMIN_COOKIE_PASSWORD ||'supersecret',
    authenticate: async (email, password) => {
      if (ADMIN.password === password && ADMIN.email === email) {
        return ADMIN
      }
      return null
    }
})

module.exports = router
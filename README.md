# Smart Rental Platform - Backend Implementation

A Symfony 6.4 application for renting tools and booking services in your community.

## 🚀 Quick Start

The application is already set up and running at: **http://127.0.0.1:8001**

## 📋 Features Implemented

### ✅ User Authentication
- Login/Logout system
- Role-based access control (Admin, Host, Guest)
- Password hashing with Symfony security

### ✅ Services Module
- **Public View**: Browse and view active services
- **Host Dashboard**: Create, edit, delete services
- **Admin Panel**: Approve/hide services for moderation

### ✅ Tools Module
- **Public View**: Browse and view active tools
- **Host Dashboard**: Create, edit, delete tools
- **Admin Panel**: Approve/hide tools for moderation

## 🔑 Test Accounts

| Role  | Email              | Password  | Access                          |
|-------|--------------------|-----------|---------------------------------|
| Admin | admin@test.com     | admin123  | Full access + moderation        |
| Host  | host@test.com      | host123   | Can create tools/services       |
| Guest | guest@test.com     | guest123  | Can browse only                 |

## 📊 Database Schema

### Tables Created:
- **user** - User accounts with roles
- **service** - Services offered by hosts
- **tool** - Tools available for rent

### Sample Data:
- 3 users (admin, host, guest)
- 2 services (1 active, 1 pending)
- 2 tools (1 active, 1 pending)

## 🛣️ Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/logout` - Logout
- `/services` - Browse services
- `/services/{id}` - Service details
- `/tools` - Browse tools
- `/tools/{id}` - Tool details

### Host Routes (Requires ROLE_HOST)
- `/host/services` - Manage services
- `/host/services/new` - Create service
- `/host/services/{id}/edit` - Edit service
- `/host/services/{id}/delete` - Delete service
- `/host/tools` - Manage tools
- `/host/tools/new` - Create tool
- `/host/tools/{id}/edit` - Edit tool
- `/host/tools/{id}/delete` - Delete tool

### Admin Routes (Requires ROLE_ADMIN)
- `/admin/services` - Moderate services
- `/admin/services/{id}/approve` - Approve service
- `/admin/services/{id}/hide` - Hide service
- `/admin/tools` - Moderate tools
- `/admin/tools/{id}/approve` - Approve tool
- `/admin/tools/{id}/hide` - Hide tool

## 🏗️ Project Structure

```
src/
├── Controller/
│   ├── HomeController.php
│   ├── SecurityController.php
│   ├── ServiceController.php
│   ├── ToolController.php
│   ├── Host/
│   │   ├── HostServiceController.php
│   │   └── HostToolController.php
│   └── Admin/
│       ├── AdminServiceController.php
│       └── AdminToolController.php
├── Entity/
│   ├── User.php
│   ├── Service.php
│   └── Tool.php
├── Form/
│   ├── ServiceType.php
│   └── ToolType.php
├── Repository/
│   ├── UserRepository.php
│   ├── ServiceRepository.php
│   └── ToolRepository.php
└── DataFixtures/
    └── AppFixtures.php
```

## 🎨 Frontend

- Bootstrap 5.3 for styling
- Responsive design
- Flash messages for user feedback
- Form validation

## 🔧 Technology Stack

- **Framework**: Symfony 6.4
- **Database**: MySQL 8.0
- **ORM**: Doctrine
- **Template Engine**: Twig
- **CSS Framework**: Bootstrap 5.3
- **PHP**: 8.1+

## 📝 Development Commands

```bash
# Start development server
symfony serve

# Create migration
php bin/console make:migration

# Run migrations
php bin/console doctrine:migrations:migrate

# Load fixtures (test data)
php bin/console doctrine:fixtures:load

# Clear cache
php bin/console cache:clear
```

## ✨ What's Next (V2 Features)

The following features are NOT included in V1 but planned for future versions:
- ❌ Reservations/Bookings
- ❌ Categories
- ❌ Image uploads
- ❌ AI features
- ❌ Payment integration
- ❌ Reviews and ratings
- ❌ Search and filters

## 🎯 Implementation Status

✅ **COMPLETE** - All V1 features from the implementation plan have been successfully built:
- User authentication system
- Service CRUD operations
- Tool CRUD operations
- Host dashboard
- Admin moderation panel
- Public viewing pages
- Test data fixtures
- Responsive UI with Bootstrap

The application is fully functional and ready for testing!

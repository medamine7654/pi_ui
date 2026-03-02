# Team Integration Guide

## Overview
This guide helps you integrate work from 3 teammates into your Symfony project.

## Pre-Integration Checklist

### ✅ Before You Start
- [ ] Backup your current project
- [ ] Ensure your project is working (run tests, check pages)
- [ ] Clear cache: `php bin/console cache:clear`
- [ ] Document your current state

### 📋 Information to Collect from Each Teammate

For **Teammate 1, 2, and 3**, collect:

1. **Modified Files List**
   - Controllers
   - Entities
   - Services
   - Templates
   - Forms
   - Repositories

2. **New Files Created**
   - Full file paths
   - Purpose of each file

3. **Database Changes**
   - Migration files (migrations/VersionXXXXXX.php)
   - New entities or entity modifications

4. **Dependencies**
   - New Composer packages
   - Updated package versions

5. **Configuration Changes**
   - config/packages/*.yaml
   - config/routes.yaml
   - .env changes

6. **Assets**
   - New images, CSS, JS files
   - Public folder changes

---

## Integration Process

### Step 1: Analyze Conflicts

Create a conflict analysis document:

```bash
# List all files that might conflict
# Compare your files with teammates' files
```

**Common Conflict Areas:**
- Routes (config/routes.yaml)
- Entities (src/Entity/)
- Controllers (src/Controller/)
- Templates (templates/)
- Services (src/Service/)
- Forms (src/Form/)

### Step 2: Merge Strategy

Choose one of these strategies:

#### Strategy A: Sequential Integration (Recommended)
Integrate one teammate at a time:
1. Integrate Teammate 1 → Test → Commit
2. Integrate Teammate 2 → Test → Commit
3. Integrate Teammate 3 → Test → Commit

#### Strategy B: Feature-Based Integration
Group by feature:
1. All authentication changes
2. All booking system changes
3. All payment changes
etc.

---

## Detailed Integration Steps

### Phase 1: Database & Entities

```bash
# 1. Collect all migration files from teammates
# Place them in migrations/ folder with proper timestamps

# 2. Check for entity conflicts
# Compare src/Entity/ files

# 3. Merge entities carefully
# If same entity modified by multiple people, merge manually

# 4. Run migrations
php bin/console doctrine:migrations:migrate

# 5. Validate schema
php bin/console doctrine:schema:validate
```

### Phase 2: Dependencies

```bash
# 1. Merge composer.json
# Combine all "require" sections from teammates

# 2. Install dependencies
composer install

# 3. Update if needed
composer update

# 4. Clear cache
php bin/console cache:clear
```

### Phase 3: Controllers & Routes

```bash
# 1. Merge route files
# Check config/routes.yaml and config/routes/ folder

# 2. Merge controllers
# Copy new controllers to src/Controller/
# For modified controllers, merge changes manually

# 3. Check for route conflicts
php bin/console debug:router

# 4. Test each route
```

### Phase 4: Services

```bash
# 1. Copy new services to src/Service/

# 2. Check services.yaml for new service definitions
# Merge config/services.yaml

# 3. Verify service container
php bin/console debug:container
```

### Phase 5: Templates

```bash
# 1. Copy new templates to templates/

# 2. For modified templates:
#    - Compare line by line
#    - Merge carefully (especially base.html.twig, _navbar.html.twig)

# 3. Check for missing includes/extends
```

### Phase 6: Forms

```bash
# 1. Copy new forms to src/Form/

# 2. Check for form type conflicts
# If same form modified, merge manually
```

### Phase 7: Assets & Public Files

```bash
# 1. Copy new images/files to public/uploads/

# 2. Merge any CSS/JS changes

# 3. Run asset commands if needed
php bin/console assets:install
```

---

## Conflict Resolution Guide

### When Files Conflict

#### For Controllers:
```php
// Your version
public function index(): Response
{
    // Your code
}

// Teammate's version
public function index(Request $request): Response
{
    // Their code
}

// Merged version - combine both
public function index(Request $request): Response
{
    // Your code
    // Their code
    // Make sure logic flows correctly
}
```

#### For Entities:
```php
// If both added different properties:
// Keep both properties
// Update migrations accordingly

// If both modified same property:
// Discuss with teammate
// Choose the better implementation
```

#### For Templates:
```twig
{# Use version control or diff tools #}
{# Merge block by block #}
{# Test rendering after merge #}
```

### Handling Route Conflicts

```yaml
# If same route name used:
# Rename one of them

# Before (conflict):
app_booking:
    path: /booking
    controller: App\Controller\BookingController::index

# After (resolved):
app_booking_list:
    path: /booking
    controller: App\Controller\BookingController::index

app_booking_create:
    path: /booking/create
    controller: App\Controller\BookingController::create
```

---

## Testing After Integration

### 1. Run All Tests
```bash
# Unit tests
php bin/phpunit

# Check for errors
php bin/console lint:twig templates/
php bin/console lint:yaml config/
```

### 2. Manual Testing Checklist
- [ ] Homepage loads
- [ ] User registration/login works
- [ ] All main features work
- [ ] Forms submit correctly
- [ ] Database operations work
- [ ] No console errors
- [ ] No PHP errors

### 3. Check Logs
```bash
# Check for errors
tail -f var/log/dev.log
```

---

## Common Issues & Solutions

### Issue 1: Migration Conflicts
**Problem:** Multiple migrations modify same table

**Solution:**
```bash
# 1. Backup database
# 2. Reset migrations
php bin/console doctrine:migrations:migrate first
# 3. Merge migration files manually
# 4. Create new migration
php bin/console make:migration
# 5. Review and run
php bin/console doctrine:migrations:migrate
```

### Issue 2: Namespace Conflicts
**Problem:** Same class name in different files

**Solution:**
- Rename one of the classes
- Update all references
- Use different namespaces

### Issue 3: Service Dependency Conflicts
**Problem:** Services depend on each other circularly

**Solution:**
- Refactor to remove circular dependency
- Use events/listeners instead
- Inject only what's needed

### Issue 4: Template Inheritance Conflicts
**Problem:** Multiple people modified base.html.twig

**Solution:**
```twig
{# Create separate blocks for each feature #}
{% block teammate1_section %}{% endblock %}
{% block teammate2_section %}{% endblock %}
{% block teammate3_section %}{% endblock %}
```

---

## Integration Workflow Script

Save this as `integrate.sh`:

```bash
#!/bin/bash

echo "=== Team Integration Script ==="
echo ""

# Step 1: Backup
echo "Step 1: Creating backup..."
git add .
git commit -m "Pre-integration backup"
git branch backup-$(date +%Y%m%d-%H%M%S)

# Step 2: Clear cache
echo "Step 2: Clearing cache..."
php bin/console cache:clear

# Step 3: Check current state
echo "Step 3: Checking current state..."
php bin/console doctrine:schema:validate

# Step 4: Install dependencies
echo "Step 4: Installing dependencies..."
composer install

# Step 5: Run migrations
echo "Step 5: Running migrations..."
php bin/console doctrine:migrations:migrate --no-interaction

# Step 6: Validate
echo "Step 6: Validating..."
php bin/console debug:router
php bin/console debug:container

# Step 7: Clear cache again
echo "Step 7: Final cache clear..."
php bin/console cache:clear

echo ""
echo "=== Integration Complete ==="
echo "Please test your application manually"
```

---

## Post-Integration

### 1. Documentation
- Document what was integrated
- Note any breaking changes
- Update README.md

### 2. Team Communication
- Inform team of integration status
- Share any issues encountered
- Document decisions made

### 3. Code Review
- Review merged code
- Check for code quality
- Ensure best practices

---

## Emergency Rollback

If integration fails:

```bash
# Using Git
git reset --hard backup-before-integration

# Manual backup
rm -rf project/
cp -r ../project-backup project/

# Restore database
php bin/console doctrine:database:drop --force
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
```

---

## Tips for Smooth Integration

1. **Communicate**: Talk to teammates about their changes
2. **Test Incrementally**: Test after each teammate's integration
3. **Use Version Control**: Commit after each successful integration
4. **Document**: Keep notes of what you did
5. **Ask for Help**: If stuck, ask teammates to explain their code
6. **Pair Program**: Consider integrating together via screen share

---

## Checklist: Integration Complete

- [ ] All teammate files integrated
- [ ] Database migrations run successfully
- [ ] All dependencies installed
- [ ] No route conflicts
- [ ] No service conflicts
- [ ] All pages load without errors
- [ ] Forms work correctly
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Team notified

---

## Need Help?

If you encounter issues:
1. Check error logs: `var/log/dev.log`
2. Run diagnostics: `php bin/console debug:*`
3. Ask teammates for clarification
4. Review Symfony documentation
5. Check for typos in merged code

Good luck with your integration! 🚀

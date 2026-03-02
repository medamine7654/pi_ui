# Quick Integration Checklist

## Before Starting
- [ ] Backup your project (Git or manual copy)
- [ ] Test that your current project works
- [ ] Get all files from teammates
- [ ] Create a list of what each teammate changed

## For Each Teammate

### Teammate 1: _______________

#### Files to Integrate
- [ ] Controllers: `src/Controller/`
- [ ] Entities: `src/Entity/`
- [ ] Services: `src/Service/`
- [ ] Forms: `src/Form/`
- [ ] Repositories: `src/Repository/`
- [ ] Templates: `templates/`
- [ ] Migrations: `migrations/`
- [ ] Config: `config/`
- [ ] Assets: `public/`

#### Integration Steps
1. [ ] Copy new files
2. [ ] Merge modified files
3. [ ] Update composer.json if needed
4. [ ] Run `composer install`
5. [ ] Run migrations: `php bin/console doctrine:migrations:migrate`
6. [ ] Clear cache: `php bin/console cache:clear`
7. [ ] Test the features
8. [ ] Commit changes

#### Testing
- [ ] Feature works correctly
- [ ] No errors in console
- [ ] No PHP errors
- [ ] Database updated correctly

---

### Teammate 2: _______________

#### Files to Integrate
- [ ] Controllers: `src/Controller/`
- [ ] Entities: `src/Entity/`
- [ ] Services: `src/Service/`
- [ ] Forms: `src/Form/`
- [ ] Repositories: `src/Repository/`
- [ ] Templates: `templates/`
- [ ] Migrations: `migrations/`
- [ ] Config: `config/`
- [ ] Assets: `public/`

#### Integration Steps
1. [ ] Copy new files
2. [ ] Merge modified files
3. [ ] Update composer.json if needed
4. [ ] Run `composer install`
5. [ ] Run migrations: `php bin/console doctrine:migrations:migrate`
6. [ ] Clear cache: `php bin/console cache:clear`
7. [ ] Test the features
8. [ ] Commit changes

#### Testing
- [ ] Feature works correctly
- [ ] No errors in console
- [ ] No PHP errors
- [ ] Database updated correctly
- [ ] No conflicts with Teammate 1's work

---

### Teammate 3: _______________

#### Files to Integrate
- [ ] Controllers: `src/Controller/`
- [ ] Entities: `src/Entity/`
- [ ] Services: `src/Service/`
- [ ] Forms: `src/Form/`
- [ ] Repositories: `src/Repository/`
- [ ] Templates: `templates/`
- [ ] Migrations: `migrations/`
- [ ] Config: `config/`
- [ ] Assets: `public/`

#### Integration Steps
1. [ ] Copy new files
2. [ ] Merge modified files
3. [ ] Update composer.json if needed
4. [ ] Run `composer install`
5. [ ] Run migrations: `php bin/console doctrine:migrations:migrate`
6. [ ] Clear cache: `php bin/console cache:clear`
7. [ ] Test the features
8. [ ] Commit changes

#### Testing
- [ ] Feature works correctly
- [ ] No errors in console
- [ ] No PHP errors
- [ ] Database updated correctly
- [ ] No conflicts with previous teammates' work

---

## Final Integration Testing

### All Features Test
- [ ] Homepage loads
- [ ] Navigation works
- [ ] User authentication works
- [ ] Logements features work
- [ ] Tools features work
- [ ] Services features work
- [ ] Search and filters work
- [ ] Forms submit correctly
- [ ] Database operations work
- [ ] Weather API works
- [ ] Favorites work
- [ ] All teammate features work together

### Technical Checks
- [ ] No console errors
- [ ] No PHP errors
- [ ] No 404 errors
- [ ] All routes work: `php bin/console debug:router`
- [ ] Schema is valid: `php bin/console doctrine:schema:validate`
- [ ] Templates lint: `php bin/console lint:twig templates/`
- [ ] YAML lint: `php bin/console lint:yaml config/`

### Performance
- [ ] Pages load quickly
- [ ] No memory issues
- [ ] Database queries optimized

---

## Common Conflicts to Watch For

### 1. Same File Modified
**Files to check:**
- `templates/base.html.twig`
- `templates/_navbar.html.twig`
- `config/routes.yaml`
- `config/services.yaml`
- `composer.json`
- `.env`

**Solution:** Merge manually, keep all features

### 2. Same Entity Modified
**Check:** `src/Entity/`

**Solution:** 
- Combine all properties
- Create new migration
- Test thoroughly

### 3. Route Name Conflicts
**Check:** `config/routes.yaml` and Controller annotations

**Solution:** Rename conflicting routes

### 4. Service Name Conflicts
**Check:** `config/services.yaml`

**Solution:** Use unique service names

---

## Emergency Commands

### If Something Breaks

```bash
# Clear all caches
php bin/console cache:clear
rm -rf var/cache/*

# Reset database (WARNING: Deletes data!)
php bin/console doctrine:database:drop --force
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load

# Reinstall dependencies
rm -rf vendor/
composer install

# Check for errors
tail -f var/log/dev.log
```

### Rollback

```bash
# If using Git
git reset --hard HEAD~1

# Or restore from backup
# (restore your backup folder)
```

---

## Post-Integration

- [ ] All features tested and working
- [ ] Documentation updated
- [ ] README.md updated
- [ ] Team notified
- [ ] Code committed
- [ ] Deployment plan created (if needed)

---

## Notes

Use this space to note any issues or decisions:

```
Teammate 1 Integration Notes:
- 

Teammate 2 Integration Notes:
-

Teammate 3 Integration Notes:
-

General Notes:
-
```

---

## Success Criteria

✅ All teammate features integrated
✅ No errors or conflicts
✅ All tests pass
✅ Application runs smoothly
✅ Team is happy! 🎉

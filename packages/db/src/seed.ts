import { db } from './client';
import { plans, appSettings } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // Seed plans
  await db.insert(plans).values([
    {
      name: 'Free',
      slug: 'free',
      description: '무료 플랜',
      price: 0,
      currency: 'KRW',
      interval: 'month',
      intervalCount: 1,
      features: ['기본 기능'],
      isActive: true,
      sortOrder: 0,
    },
    {
      name: 'Pro',
      slug: 'pro',
      description: '프로 플랜',
      price: 9900,
      currency: 'KRW',
      interval: 'month',
      intervalCount: 1,
      features: ['기본 기능', '프로 기능', '우선 지원'],
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      description: '엔터프라이즈 플랜',
      price: 49900,
      currency: 'KRW',
      interval: 'month',
      intervalCount: 1,
      features: ['기본 기능', '프로 기능', '우선 지원', '전담 매니저', 'SLA'],
      isActive: true,
      sortOrder: 2,
    },
  ]).onConflictDoNothing();

  // Seed app settings
  await db.insert(appSettings).values([
    {
      key: 'site_name',
      value: 'OhMyNextJS',
      description: '사이트 이름',
      isPublic: true,
    },
    {
      key: 'maintenance_mode',
      value: false,
      description: '유지보수 모드',
      isPublic: true,
    },
    {
      key: 'default_plan',
      value: 'free',
      description: '기본 요금제 slug',
      isPublic: false,
    },
  ]).onConflictDoNothing();

  console.log('✅ Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

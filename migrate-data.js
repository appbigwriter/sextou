const { PrismaClient } = require('@prisma/client');

async function migrateData() {
  console.log("Starting data migration...");

  const oldDb = new PrismaClient({
    datasources: {
      db: { url: "postgres://postgres:cbecc04c97ffff3d0486@148.230.94.24:5432/webserver2?sslmode=disable" }
    }
  });

  const newDb = new PrismaClient({
    datasources: {
      db: { url: "postgresql://postgres.mgslptjeznjxmfbkmngz:UfCy0O1vcZAKkMhB@aws-1-us-west-2.pooler.supabase.com:5432/postgres" }
    }
  });

  try {
    // 1. Users
    const users = await oldDb.user.findMany();
    console.log(`Migrating ${users.length} users...`);
    for (const user of users) {
      await newDb.user.create({ data: user });
    }

    // 2. Categories
    const categories = await oldDb.category.findMany();
    console.log(`Migrating ${categories.length} categories...`);
    for (const cat of categories) {
      await newDb.category.create({ data: cat });
    }

    // 3. Ads
    const ads = await oldDb.ad.findMany();
    console.log(`Migrating ${ads.length} ads...`);
    for (const ad of ads) {
      await newDb.ad.create({ data: ad });
    }

    // 4. Ad Images
    const adImages = await oldDb.adImage.findMany();
    console.log(`Migrating ${adImages.length} ad images...`);
    for (const img of adImages) {
      await newDb.adImage.create({ data: img });
    }

    // 5. Ad Videos
    const adVideos = await oldDb.adVideo.findMany();
    console.log(`Migrating ${adVideos.length} ad videos...`);
    for (const vid of adVideos) {
      await newDb.adVideo.create({ data: vid });
    }

    // 6. Payments
    const payments = await oldDb.payment.findMany();
    console.log(`Migrating ${payments.length} payments...`);
    for (const payment of payments) {
      await newDb.payment.create({ data: payment });
    }

    // 7. Master Territories
    const masterTerritories = await oldDb.masterTerritory.findMany();
    console.log(`Migrating ${masterTerritories.length} master territories...`);
    for (const mt of masterTerritories) {
      await newDb.masterTerritory.create({ data: mt });
    }

    // 8. Affiliate Territories
    const affiliateTerritories = await oldDb.affiliateTerritory.findMany();
    console.log(`Migrating ${affiliateTerritories.length} affiliate territories...`);
    for (const at of affiliateTerritories) {
      await newDb.affiliateTerritory.create({ data: at });
    }

    console.log("Data migration completed successfully!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await oldDb.$disconnect();
    await newDb.$disconnect();
  }
}

migrateData();

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seed() {
  let connection;
  try {
    // Connect without database first to create it
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schema);
    console.log('✅ Schema created');

    // Switch to our database
    await connection.changeUser({ database: process.env.DB_NAME || 'bodals_international' });

    // 1. Seed Admin
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    await connection.query(
      `INSERT INTO admins (name, email, password) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      ['Admin', 'admin@bodalsinternational.com', hashedPassword]
    );
    console.log('✅ Admin user created');

    // 2. Seed Website Settings
    const [existingSettings] = await connection.query('SELECT id FROM website_settings LIMIT 1');
    if (existingSettings.length === 0) {
      await connection.query(`INSERT INTO website_settings
        (company_name, motto, hero_title, hero_subtitle, about_us, vision, purpose, mobile, email, address, footer_text)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        "BODAL'S INTERNATIONAL",
        'WE CARE, WE COMMIT, WE CONNECT',
        "BODAL'S INTERNATIONAL",
        'Your trusted gateway to premium Indian seafood, textiles, fresh produce, cereals, and coffee — delivered to discerning buyers across the globe.',
        `At BODAL'S INTERNATIONAL, we are a dynamic and forward-thinking merchant export house dedicated to bringing the finest Indian products to the global market. Rooted in India's rich agricultural and manufacturing heritage, our mission is to serve as a reliable bridge between authentic Indian producers and international buyers who demand excellence.\n\nWhile our approach is modern and globally minded, our core values are built on traditional principles of trust, transparency, and unwavering commitment to quality. We have assembled a highly skilled team with deep industry knowledge, robust sourcing capabilities, and a meticulous understanding of global supply chain logistics.\n\nWhether you are looking for premium agricultural goods, high-grade seafood, or quality textiles, we are equipped with the resources, agility, and expertise to deliver unparalleled value. We don't just export products; we build long-term, mutually beneficial partnerships across borders.`,
        `To be the world's most trusted gateway for Indian excellence, where the values of Care, Commitment, and Connection redefine the standards of global trade. We envision a future where every partner—from the coastal fishers of the Konkan to our international clientele—thrives through a transparent, efficient, and sustainable supply chain.`,
        `Our purpose is to bridge the distance between India's rich resources and the global demand for quality through a promise-led business model. We exist to simplify international trade, providing a seamless and reliable path for premium Indian Shrimps, Textiles, and Agricultural products to reach every corner of the world. At Bodal's, we don't just move goods; we build the infrastructure of global trust.`,
        '+91 9082377097',
        'b.manish95@gmail.com',
        'Mumbai, Maharashtra, India',
        "Premium Indian merchant export house — connecting authentic producers with international buyers."
      ]);
      console.log('✅ Website settings created');
    } else {
      console.log('⏭️  Website settings already exist, skipping');
    }

    // 3. Seed Products
    const [existingProducts] = await connection.query('SELECT COUNT(*) as c FROM products');
    if (existingProducts[0].c === 0) {
      const products = [
        ['High-Quality Seafood', 'Seafood', 'Premium IQF shrimp from Konkan & Andhra coasts.', 'Sourced from pristine waters and processed in state-of-the-art, certified facilities, we provide fresh and frozen seafood that guarantees exceptional taste, texture, and safety. Specialised in Shrimp (IQF) directly sourced from Konkan and Andhra Coast.', '["IQF Certified", "MPEDA Approved", "Pristine Sourcing"]'],
        ['Premium Textiles', 'Textiles', 'Indian silk, fabrics & contemporary weaves.', "Drawing from India's legacy of fabric craftsmanship, we supply premium textiles, fabrics, and premium Indian silk, ensuring excellent thread counts, durability, and contemporary appeal for the global fashion and manufacturing industries.", '["Heritage Craft", "Export Quality", "Custom Weaves"]'],
        ['Fresh Agricultural Produce', 'Fresh Agricultural', 'Farm-fresh onions, potatoes, fruits & vegetables.', 'We source farm-fresh, nutrient-rich produce directly from trusted growers. Our key offerings include premium onions, potatoes, an array of seasonal vegetables, and vibrant, export-quality fruits.', '["Farm Direct", "Nutrient-Rich", "Seasonal Range"]'],
        ['Cereals & Grains', 'Cereals & Grains', 'Carefully processed, food-safe Indian grains.', "India is the world's breadbasket, and we export high-quality, carefully processed cereals and grains that meet the highest standards of food safety and nutritional value.", '["Food Safety", "Bulk Supply", "Global Standards"]'],
        ['Premium Indian Coffee', 'Premium Indian Coffee', "Robusta Cherry AA from India's finest estates.", "Harvested from India's finest estates, our coffee exports offer rich aromas and distinct flavor profiles, catering to the discerning tastes of global coffee roasters and distributors. Includes Indian Robusta Cherry AA Coffee.", '["Estate Grown", "Robusta AA", "Distinct Aroma"]']
      ];
      for (const p of products) {
        await connection.query(
          'INSERT INTO products (name, category, short_description, full_description, badges, status) VALUES (?, ?, ?, ?, ?, "active")', p
        );
      }
      console.log('✅ Products seeded (5 products)');
    } else {
      console.log('⏭️  Products already exist, skipping');
    }

    // 4. Seed Certifications
    const [existingCerts] = await connection.query('SELECT COUNT(*) as c FROM certifications');
    if (existingCerts[0].c === 0) {
      const certs = [
        ['IEC', 'Importer Exporter Code', 'Official government registration for import/export operations.'],
        ['FSSAI', 'Food Safety & Standards', 'Food safety compliance certification by FSSAI India.'],
        ['APEDA', 'Agricultural Products Export', 'Registration for export of agricultural products.'],
        ['UDYAM', 'MSME Registration', 'Micro, Small and Medium Enterprises registration.'],
        ['MPEDA', 'Marine Products Export', 'Marine Products Export Development Authority registration.'],
        ['HALAL', 'Halal Certification', 'Halal compliance certification for eligible products.']
      ];
      for (const c of certs) {
        await connection.query(
          'INSERT INTO certifications (name, full_name, description, status) VALUES (?, ?, ?, "active")', c
        );
      }
      console.log('✅ Certifications seeded (6 certs)');
    } else {
      console.log('⏭️  Certifications already exist, skipping');
    }

    // 5. Seed Specialities
    const [existingSpecs] = await connection.query('SELECT COUNT(*) as c FROM specialities');
    if (existingSpecs[0].c === 0) {
      const specs = [
        ['Direct Sourcing', 'Straight from trusted Indian producers.', 'Sprout', 1],
        ['Quality Guaranteed', 'Every batch meets export-grade standards.', 'ShieldCheck', 2],
        ['On-Demand Sourcing', 'Custom orders to your specification.', 'Search', 3],
        ['Global Compliance', 'Aligned with international regulations.', 'Globe2', 4],
        ['Competitive Pricing', 'Best-in-class value without compromise.', 'Tag', 5],
        ['Custom Packaging', 'Branded packaging & labelling support.', 'Package', 6],
        ['Film to Jute Bags', 'Multiple packaging formats available.', 'ShoppingBag', 7],
        ['Swift Logistics', 'Reliable end-to-end shipping.', 'Truck', 8],
        ['Transparent Trade', 'Clear documentation at every step.', 'Eye', 9],
        ['Rigorous Inspection', 'Multi-stage quality checks.', 'ScanSearch', 10],
        ['End-to-End Support', 'Dedicated team from query to delivery.', 'Headphones', 11],
        ['Ethical Partnership', 'Long-term, fair trade relationships.', 'HeartHandshake', 12]
      ];
      for (const s of specs) {
        await connection.query(
          'INSERT INTO specialities (title, description, icon, sort_order, status) VALUES (?, ?, ?, ?, "active")', s
        );
      }
      console.log('✅ Specialities seeded (12 items)');
    } else {
      console.log('⏭️  Specialities already exist, skipping');
    }

    // 6. Seed Core Values
    const [existingValues] = await connection.query('SELECT COUNT(*) as c FROM core_values');
    if (existingValues[0].c === 0) {
      const values = [
        ['We Care', 'Product Integrity', 'We believe that quality begins with respect for the origin.', 'Heart', 1],
        ['We Commit', 'Reliability & Ethics', 'We believe that our word is our strongest contract.', 'ShieldCheck', 2],
        ['We Connect', 'Communication & Partnership', 'We believe that trade is built on human relationships.', 'Network', 3]
      ];
      for (const v of values) {
        await connection.query(
          'INSERT INTO core_values (title, subtitle, description, icon, sort_order, status) VALUES (?, ?, ?, ?, ?, "active")', v
        );
      }
      console.log('✅ Core values seeded (3 values)');
    } else {
      console.log('⏭️  Core values already exist, skipping');
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('   Admin email: admin@bodalsinternational.com');
    console.log('   Admin password: Admin@123\n');

  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
}

seed();

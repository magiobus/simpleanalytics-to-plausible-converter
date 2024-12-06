const fs = require("fs");
const csv = require("csv-parser");

// Constants for file names
const DATE_RANGE = "XXXXXXXX_XXXXXXXX"; // Adjust this according to your date range
const INPUT_FILE = "inputfile.csv";

// Functions to write different CSVs
function writeVisitorsCSV(records) {
  let output =
    '"date","visitors","pageviews","bounces","visits","visit_duration"\n';
  records.forEach((record) => {
    output += `"${record.date}",${record.visitors},${record.pageviews},${record.bounces},${record.visits},${record.visit_duration}\n`;
  });
  fs.writeFileSync(`imported_visitors_${DATE_RANGE}.csv`, output);
}

function writePagesCSV(records) {
  let output = '"date","hostname","page","visits","visitors","pageviews"\n';
  records.forEach((record) => {
    output += `"${record.date}","${record.hostname}","${record.page}",${record.visits},${record.visitors},${record.pageviews}\n`;
  });
  fs.writeFileSync(`imported_pages_${DATE_RANGE}.csv`, output);
}

function writeBrowsersCSV(records) {
  let output =
    '"date","browser","browser_version","visitors","visits","visit_duration","bounces","pageviews"\n';
  records.forEach((record) => {
    output += `"${record.date}","${record.browser}","${record.browser_version}",${record.visitors},${record.visits},${record.visit_duration},${record.bounces},${record.pageviews}\n`;
  });
  fs.writeFileSync(`imported_browsers_${DATE_RANGE}.csv`, output);
}

function writeDevicesCSV(records) {
  let output =
    '"date","device","visitors","visits","visit_duration","bounces","pageviews"\n';
  records.forEach((record) => {
    output += `"${record.date}","${record.device}",${record.visitors},${record.visits},${record.visit_duration},${record.bounces},${record.pageviews}\n`;
  });
  fs.writeFileSync(`imported_devices_${DATE_RANGE}.csv`, output);
}

function writeEntryPagesCSV(records) {
  let output =
    '"date","entry_page","visitors","entrances","visit_duration","bounces","pageviews"\n';
  records.forEach((record) => {
    output += `"${record.date}","${record.entry_page}",${record.visitors},${record.entrances},${record.visit_duration},${record.bounces},${record.pageviews}\n`;
  });
  fs.writeFileSync(`imported_entry_pages_${DATE_RANGE}.csv`, output);
}

function writeOperatingSystemsCSV(records) {
  let output =
    '"date","operating_system","operating_system_version","visitors","visits","visit_duration","bounces","pageviews"\n';
  records.forEach((record) => {
    output += `"${record.date}","${record.operating_system}","${record.operating_system_version}",${record.visitors},${record.visits},${record.visit_duration},${record.bounces},${record.pageviews}\n`;
  });
  fs.writeFileSync(`imported_operating_systems_${DATE_RANGE}.csv`, output);
}

// Maps to store different statistics
const dailyStats = new Map();
const dailyPageStats = new Map();
const dailyBrowserStats = new Map();
const dailyDeviceStats = new Map();
const dailyEntryPageStats = new Map();
const dailyOSStats = new Map();

fs.createReadStream(INPUT_FILE)
  .pipe(csv())
  .on("data", (row) => {
    const date = row.added_date;
    const pageKey = `${date}-${row.path}`;
    const browserKey = `${date}-${row.browser_name}-${row.browser_version}`;
    const deviceKey = `${date}-${row.device_type}`;
    const entryPageKey = `${date}-${row.path}`;
    const osKey = `${date}-${row.os_name}-${row.os_version}`;

    // Initialize daily stats
    if (!dailyStats.has(date)) {
      dailyStats.set(date, {
        date,
        visitors: 0,
        pageviews: 0,
        bounces: 0,
        visits: 0,
        visit_duration: 0,
      });
    }

    // Initialize page stats
    if (!dailyPageStats.has(pageKey)) {
      dailyPageStats.set(pageKey, {
        date,
        hostname: row.hostname,
        page: row.path || "/",
        visits: 0,
        visitors: 0,
        pageviews: 0,
      });
    }

    // Initialize browser stats
    if (!dailyBrowserStats.has(browserKey)) {
      dailyBrowserStats.set(browserKey, {
        date,
        browser: row.browser_name || "",
        browser_version: row.browser_version || "",
        visitors: 0,
        visits: 0,
        visit_duration: 0,
        bounces: 0,
        pageviews: 0,
      });
    }

    // Initialize device stats
    if (!dailyDeviceStats.has(deviceKey)) {
      dailyDeviceStats.set(deviceKey, {
        date,
        device: row.device_type || "",
        visitors: 0,
        visits: 0,
        visit_duration: 0,
        bounces: 0,
        pageviews: 0,
      });
    }

    // Initialize entry pages stats
    if (!dailyEntryPageStats.has(entryPageKey)) {
      dailyEntryPageStats.set(entryPageKey, {
        date,
        entry_page: row.path || "/",
        visitors: 0,
        entrances: 0,
        visit_duration: 0,
        bounces: 0,
        pageviews: 0,
      });
    }

    // Initialize operating systems stats
    if (!dailyOSStats.has(osKey)) {
      dailyOSStats.set(osKey, {
        date,
        operating_system: row.os_name || "",
        operating_system_version: row.os_version || "",
        visitors: 0,
        visits: 0,
        visit_duration: 0,
        bounces: 0,
        pageviews: 0,
      });
    }

    // Get references to stats objects
    const stats = dailyStats.get(date);
    const pageStats = dailyPageStats.get(pageKey);
    const browserStats = dailyBrowserStats.get(browserKey);
    const deviceStats = dailyDeviceStats.get(deviceKey);
    const entryPageStats = dailyEntryPageStats.get(entryPageKey);
    const osStats = dailyOSStats.get(osKey);

    // Increment pageviews
    stats.pageviews++;
    pageStats.pageviews++;
    browserStats.pageviews++;
    deviceStats.pageviews++;
    entryPageStats.pageviews++;
    osStats.pageviews++;

    // Process unique hits
    if (row.is_unique === "true") {
      const duration = parseInt(row.duration_seconds || 0);
      const isBounce = !row.duration_seconds || duration === 0;

      // Update general stats
      stats.visitors++;
      stats.visits++;
      stats.visit_duration += duration;
      if (isBounce) stats.bounces++;

      // Update page stats
      pageStats.visitors++;
      pageStats.visits++;

      // Update browser stats
      browserStats.visitors++;
      browserStats.visits++;
      browserStats.visit_duration += duration;
      if (isBounce) browserStats.bounces++;

      // Update device stats
      deviceStats.visitors++;
      deviceStats.visits++;
      deviceStats.visit_duration += duration;
      if (isBounce) deviceStats.bounces++;

      // Update entry pages stats
      entryPageStats.visitors++;
      entryPageStats.entrances++;
      entryPageStats.visit_duration += duration;
      if (isBounce) entryPageStats.bounces++;

      // Update operating systems stats
      osStats.visitors++;
      osStats.visits++;
      osStats.visit_duration += duration;
      if (isBounce) osStats.bounces++;
    }
  })
  .on("end", () => {
    // Helper function to sort by date
    const sortByDate = (a, b) => a.date.localeCompare(b.date);

    // Write all CSV files
    writeVisitorsCSV(Array.from(dailyStats.values()).sort(sortByDate));
    writePagesCSV(
      Array.from(dailyPageStats.values()).sort((a, b) => {
        return a.date === b.date
          ? a.page.localeCompare(b.page)
          : a.date.localeCompare(b.date);
      })
    );
    writeBrowsersCSV(
      Array.from(dailyBrowserStats.values()).sort((a, b) => {
        return a.date === b.date
          ? a.browser.localeCompare(b.browser)
          : a.date.localeCompare(b.date);
      })
    );
    writeDevicesCSV(
      Array.from(dailyDeviceStats.values()).sort((a, b) => {
        return a.date === b.date
          ? a.device.localeCompare(b.device)
          : a.date.localeCompare(b.date);
      })
    );
    writeEntryPagesCSV(
      Array.from(dailyEntryPageStats.values()).sort((a, b) => {
        return a.date === b.date
          ? a.entry_page.localeCompare(b.entry_page)
          : a.date.localeCompare(b.date);
      })
    );
    writeOperatingSystemsCSV(
      Array.from(dailyOSStats.values()).sort((a, b) => {
        return a.date === b.date
          ? a.operating_system.localeCompare(b.operating_system)
          : a.date.localeCompare(b.date);
      })
    );

    console.log(
      "All CSVs have been successfully converted to Plausible format"
    );
  });

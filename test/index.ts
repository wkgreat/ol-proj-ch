const tests = require.context('./', true, /\.test\.tsx?$/);

tests.keys().forEach(tests);

const sources = require.context('../src/', true, /\.tsx?$/);

sources.keys().forEach(sources);

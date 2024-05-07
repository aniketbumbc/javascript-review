const fileSystem = {
  documents: {
    files: ['work.text', 'anination.png', 'personal.jpeg'],
  },

  work: {
    urgent: {
      files: ['personal.pdf'],
    },
    lowpiority: {
      files: ['personal-old.pdf'],
    },
  },
};

console.log(getFileNames(fileSystem));

function getFileNames(fs) {
  const allFiles = [];
  for (const identifier in fs) {
    if (Array.isArray(fs[identifier])) {
      allFiles.push(...fs[identifier]);
    } else {
      allFiles.push(...getFileNames(fs[identifier]));
    }
  }

  return allFiles;
}

const Helpers = {
  getRandomFlowerColor: () => {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },
  getRandomLeafColor: () => {
    const colors = [0x3a5f0b, 0x77a37a, 0x5f926a, 0x587e60, 0x485e52, 0x3a4f3f];
    return colors[Math.floor(Math.random() * 6)];
  },
  getRandomBarkColor: () => {
    const colors = [0x2c2015, 0x3d2f20, 0x726550, 0x695a54, 0xa0938c, 0x807153];
    return colors[Math.floor(Math.random() * 6)];
  },
  pickRandomTree: () => Math.floor(Math.random() * 50), // probablity 1/50
};

export default Helpers;

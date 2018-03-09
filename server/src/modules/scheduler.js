const Genetic = require('genetic-js');

const generateSchedule = (rooms, times, sessions, callback) => {
  const genetic = Genetic.create();

  genetic.seed = () => {
    const shuffle = (array) => {
      let currentIndex = array.length;

      while (0 !== currentIndex) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        const temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    };

    const sessionsIds = Object.keys(this.userData.sessions);
    return shuffle(sessionsIds);
  };

  genetic.fitness = (array) => {
    const arrayToMatrix = (array, numRows, numColumns) => {
      let matrix = [];

      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
          if (j === 0) matrix[i] = [];
          matrix[i].push(array[i * numColumns + j]);
        }
      }

      return matrix;
    };

    const slotMatrix = arrayToMatrix(array, this.userData.times.length, this.userData.rooms.length);

    let score = 0;

    for (let i = 0; i < slotMatrix.length; i++) {
      const yesSet = new Set();
      const alternateSet = new Set();
      const facilitatorSet = new Set();
      let yesCount = 0;
      let alternateCount = 0;
      let facilitatorCount = 0;
      for (let j = 0; j < slotMatrix[i].length; j++) {
        const sessionIndex = slotMatrix[i][j];
        const yesUsers = this.userData.sessions[sessionIndex].yesVoteUserIds;
        yesCount += yesUsers.length;
        yesUsers.forEach(user => yesSet.add(user));
        const altUsers = this.userData.sessions[sessionIndex].altVoteUserIds;
        alternateCount += altUsers.length;
        altUsers.forEach((user) => {
          if (yesSet.has(user)) alternateCount--;
          else alternateSet.add(user);
        });
        const facilitatorUsers = this.userData.sessions[sessionIndex].facilitatorUsersIds;
        facilitatorCount += facilitatorUsers.length;
        facilitatorUsers.forEach(user => facilitatorSet.add(user));
      }
      score += 100 * (facilitatorCount - facilitatorSet.size) + (yesCount - yesSet.size) + 0.25 * (alternateCount - alternateSet.size);
    }

    return score;
  };

  genetic.mutate = (array) => {
    const randomIndex1 = Math.floor(Math.random() * array.length);
    let randomIndex2 = Math.floor(Math.random() * (array.length - 1));

    if (randomIndex2 >= randomIndex1) randomIndex2++;

    const returnArray = array.slice();

    const temporaryValue = array[randomIndex1];
    returnArray[randomIndex1] = array[randomIndex2];
    returnArray[randomIndex2] = temporaryValue;

    return returnArray;
  };

  genetic.optimize = Genetic.Optimize.Minimize;
  genetic.select1 = Genetic.Select1.Tournament2;

  genetic.notification = (pop, gen, stats, isFinished) => {
    if (isFinished) {
      callback(pop, gen, stats);
    }
  };

  const config = {
    iterations: 100,
  };

  const userData = {
    rooms,
    times,
    sessions,
  };

  genetic.evolve(config, userData);
};

module.exports = generateSchedule;

const Genetic = require('genetic-js');

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

  const numTimeSlots = 5;
  const numRooms = 4;

  return shuffle([...Array(numTimeSlots * numRooms).keys()]);
};

genetic.fitness = (array) => {
  const multiArray = [
    [array[0], array[1], array[2], array[3]],
    [array[4], array[5], array[6], array[7]],
    [array[8], array[9], array[10], array[11]],
    [array[12], array[13], array[14], array[15]],
    [array[16], array[17], array[18], array[19]],
  ];

  const sessionUsers = [
    ['kbirkey@gemedot.com', 'TJF', 'Darcinurkkala', 'bof-bof', 'gregb', 'CoreyK', 'woodsbw', 'russ.tuck', 'Tparr', 'Jtaylor', 'dgg', 'todd.shinabarger@om.org', 'Ryanmathias', 'Khc12a', 'Lorenm'],
    ['iccm@halfmile.com', 'Rayfergs', 'courtneyh', 'TJF', 'creimer', 'arthur.mason@sim.org', 'bof-bof', 'iccm12345', 'gregb', 'jeff@dgjc.org', 'Jeff@Christianaid.org', 'Edward.delarosa@christianaid.org', 'Lnelson@hlg.edu', 'jdudeck'],
    ['iccm@halfmile.com', 'Rayfergs', 'joshbrower', 'NickJohnson', 'Joseph', 'Kevin W', 'TJF', 'JLfromTx', 'bof-bof', 'nurkkala', 'CoreyK', 'Bill.Dickson ', 'Lnelson@hlg.edu'],
    ['iccm@halfmile.com', 'jwilliams@globalnaz.org', 'joshbrower', 'Joseph', 'CraigT', 'bof-bof', 'iccm12345', 'CoreyK', 'Jeff@Christianaid.org', 'dgg', 'Khc12a', 'vtberg', 'EdEby'],
    ['richard ingram', 'Joseph', 'CraigT', 'Darcinurkkala', 'woodsbw', 'russ.tuck', 'Bill.Dickson ', 'gharris@teamexpansion.org', 'Lnelson@hlg.edu'],
    ['kbirkey@gemedot.com', 'Caroline', 'Demoorehuis', 'creimer', 'gregb', 'Holger', 'Tparr', 'crdaudt@taylor.edu', 'Mcdanielj@ywamsf.org'],
    ['jason.maas', 'TJF', 'gregb', 'CarlA', 'nurkkala', 'woodsbw', 'Bill.Dickson ', 'crdaudt@taylor.edu', 'mckinnis', 'jdudeck'],
    ['gustavohellwig', 'richard ingram', 'NickJohnson', 'Bill.Dickson ', 'todd.shinabarger@om.org', 'Edward.delarosa@christianaid.org', 'gharris@teamexpansion.org', 'vtberg', 'Mcdanielj@ywamsf.org'],
    ['iccm@halfmile.com', 'courtneyh', 'Demoorehuis', 'creimer', 'GCamp', 'mckinnis', 'Lorenm', 'Mcdanielj@ywamsf.org'],
    ['Rayfergs', 'BradFirestone', 'Caroline', 'jmeester@cimonline.org', 'JLfromTx', 'jeff@dgjc.org', 'Tparr', 'apendleton@cimonline.org', 'vtberg'],
    ['jason.maas', 'LisaHelbig', 'courtneyh', 'TJF', 'jeff@dgjc.org', 'njw13a', 'Tparr', 'dgg', 'Laura', 'vtberg'],
    ['BradFirestone', 'richard ingram', 'Demoorehuis', 'GCamp', 'njw13a', 'todd.shinabarger@om.org', 'Edward.delarosa@christianaid.org', 'Mcdanielj@ywamsf.org'],
    ['Rayfergs', 'jwilliams@globalnaz.org', 'JLfromTx', 'gregb', 'njw13a', 'Jeff@Christianaid.org', 'dgg', 'apendleton@cimonline.org', 'gharris@teamexpansion.org'],
    ['jason.maas', 'LisaHelbig', 'BradFirestone', 'richard ingram', 'Demoorehuis', 'apendleton@cimonline.org', 'mckinnis', 'EdEby'],
    ['jason.maas', 'joshbrower', 'Caroline', 'dbeeley', 'jeff@dgjc.org', 'Khc12a', 'mckinnis'],
    ['jwilliams@globalnaz.org', 'courtneyh', 'BradFirestone', 'jmeester@cimonline.org', 'Joseph', 'njw13a', 'gharris@teamexpansion.org'],
    ['iccm@halfmile.com', 'Kevin W', 'creimer', 'GCamp', 'woodsbw', 'gharris@teamexpansion.org', 'mckinnis'],
    ['jwilliams@globalnaz.org', 'BradFirestone', 'richard ingram', 'NickJohnson', 'Jeff@Christianaid.org'],
    ['kbirkey@gemedot.com', 'Darcinurkkala', 'dbeeley', 'nurkkala', 'dgg', 'todd.shinabarger@om.org'],
    [],
  ];

  const alternateUsers = [
    ['iccm@halfmile.com', 'mrpete', 'Caroline', 'NickJohnson', 'jeff@dgjc.org', 'Lnelson@hlg.edu'],
    ['mrpete', 'richard ingram', 'NickJohnson', 'russ.tuck', 'Khc12a', 'Mcdanielj@ywamsf.org'],
    ['courtneyh', 'richard ingram', 'gregb', 'russ.tuck', 'apendleton@cimonline.org', 'Khc12a'],
    ['courtneyh', 'BradFirestone', 'richard ingram', 'GCamp', 'woodsbw', 'Edward.delarosa@christianaid.org', 'gharris@teamexpansion.org', 'Lnelson@hlg.edu', 'Mcdanielj@ywamsf.org'],
    ['Rayfergs', 'Caroline', 'Laura', 'Mcdanielj@ywamsf.org'],
    ['iccm@halfmile.com', 'Rayfergs', 'mrpete', 'jwilliams@globalnaz.org', 'courtneyh', 'BradFirestone', 'richard ingram', 'NickJohnson', 'jeff@dgjc.org', 'Jtaylor', 'Khc12a'],
    ['Rayfergs', 'mrpete', 'tim.young', 'richard ingram', 'NickJohnson', 'russ.tuck', 'Jeff@Christianaid.org', 'Khc12a', 'Lnelson@hlg.edu'],
    ['iccm@halfmile.com', 'jwilliams@globalnaz.org', 'Joseph', 'Lnelson@hlg.edu'],
    ['mrpete', 'richard ingram', 'NickJohnson', 'CraigT', 'gregb', 'russ.tuck', 'Khc12a'],
    ['jwilliams@globalnaz.org', 'dgg', 'Mcdanielj@ywamsf.org'],
    ['CraigT', 'russ.tuck', 'Khc12a'],
    ['courtneyh', 'creimer', 'apendleton@cimonline.org', 'EdEby'],
    ['mrpete', 'jeff@dgjc.org', 'Mcdanielj@ywamsf.org'],
    ['iccm@halfmile.com', 'courtneyh', 'creimer', 'GCamp', 'Edward.delarosa@christianaid.org', 'Mcdanielj@ywamsf.org'],
    ['NickJohnson', 'TJF', 'Demoorehuis', 'gregb', 'CarlA', 'russ.tuck'],
    ['Rayfergs', 'Demoorehuis', 'creimer', 'Mcdanielj@ywamsf.org'],
    ['BradFirestone', 'russ.tuck', 'Khc12a', 'Mcdanielj@ywamsf.org'],
    ['iccm@halfmile.com', 'woodsbw', 'apendleton@cimonline.org', 'Ryanmathias', 'Khc12a'],
    ['mrpete', 'gregb', 'Lnelson@hlg.edu'],
    [],
  ];

  const facilitators = [
    ['dbeeley'],
    ['joshbrower', ' CoreyK'],
    ['mrpete', ' Tammy'],
    ['Tammy'],
    ['mrpete', ' TJF', ' dbeeley', ' Klannon', ' Tammy'],
    ['Klannon', ' Tammy', ' EdEby'],
    ['Kevin W'],
    ['jmeester@cimonline.org', ' apendleton@cimonline.org'],
    ['CarlA', ' apendleton@cimonline.org'],
    ['ioa13a@acu.edu', ' dreinhart@globalnaz.org'],
    ['ioa13a@acu.edu'],
    ['NickJohnson', ' dreinhart@globalnaz.org'],
    ['jmeester@cimonline.org'],
    ['NickJohnson'],
    ['CraigT'],
    ['dreinhart@globalnaz.org'],
    ['CarlA'],
    ['CraigT', ' JLfromTx'],
    ['russ.tuck'],
    ['ioa13a@acu.edu'],
  ];

  let score = 0;

  for (let i = 0; i < multiArray.length; i++) {
    const set = new Set();
    const alternateSet = new Set();
    const facilitatorSet = new Set();
    let count = 0;
    let alternateCount = 0;
    let facilitatorCount = 0;
    for (let j = 0; j < multiArray[i].length; j++) {
      const sessionIndex = multiArray[i][j];
      const users = sessionUsers[sessionIndex];
      count += users.length;
      users.forEach(user => set.add(user));
      const altUsers = alternateUsers[sessionIndex];
      alternateCount += altUsers.length;
      altUsers.forEach((user) => {
        if (!set.has(alternateSet.add(user))) alternateSet.add(user);
      });
      const facilitatorUsers = facilitators[sessionIndex];
      facilitatorCount += facilitatorUsers.length;
      facilitatorUsers.forEach(user => facilitatorSet.add(user));
    }
    score += 100 * (facilitatorCount - facilitatorSet.size) + (count - set.size) + 0.25 * (alternateCount - alternateSet.size);
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
  console.log(gen);
  if (isFinished) {
    console.log(pop);
  }
};

const config = {
  iterations: 1000,
};

genetic.evolve(config);

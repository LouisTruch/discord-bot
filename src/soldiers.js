export class Soldier {
  constructor(login) {
    this.login = login;
  }
  lastSeen = 0;
  pc = '';
  alreadyFound = false;
};

export let arraySoldiers = [];
arraySoldiers.push(new Soldier('jemercie'));
arraySoldiers.push(new Soldier('ltruchel'));
arraySoldiers.push(new Soldier('vkerob'));
arraySoldiers.push(new Soldier('julemart'));
arraySoldiers.push(new Soldier('adamiens'));
arraySoldiers.push(new Soldier('jvasseur'));
arraySoldiers.push(new Soldier('averdon'));
arraySoldiers.push(new Soldier('thellego'));
arraySoldiers.push(new Soldier('eguillau'));
arraySoldiers.push(new Soldier('ulayus'));
arraySoldiers.push(new Soldier('nlocusso'));
arraySoldiers.push(new Soldier('tdeverge'));
arraySoldiers.push(new Soldier('mlauro'));
arraySoldiers.push(new Soldier('madegryc'));
arraySoldiers.push(new Soldier('ehalliez'));
arraySoldiers.push(new Soldier('hubourge'));
arraySoldiers.push(new Soldier('cbourre'));
arraySoldiers.push(new Soldier('tguerin'));
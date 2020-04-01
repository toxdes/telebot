const a = [
  { username: "cool" },
  { username: "ajdsaksjd" },
  { username: "askdfja" },
  { username: "alfjaf" },
  { username: "akdjakfjaksjfa" },
  { username: "askdjad" }
];

let temp = "";
for (const each of a) {
  temp = `${temp}\n@${each.username}`;
}

console.log(temp);

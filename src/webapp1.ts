import express from 'express';
import fs from 'fs';
import path from 'path'
import https from 'https';
import { auth, requiresAuth } from 'express-openid-connect'; 
import dotenv from 'dotenv'
import { Competition, Team, CompetitionTeam, Match,
  getCompetitionsByCreator,
  insertCompetition,
  getMatchesByCompetition, 
  getMatchById,
  insertTeam,
  insertCompetitionTeam,
  insertMatch,
  updateMatch,
  getCompetitionTeams,
  getCompetitionTeamsById,
  getCompetitionByName,
  getCompetitionTeamByIds,
  updateCompetitionTeam,
  getCompetitionById} from './db_app';
import { url } from 'inspector';
dotenv.config()

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 8080;

const config = { 
  authRequired : false,
  idpLogout : true, //login not only from the app, but also from identity provider
  secret: process.env.SECRET,
  baseURL: externalUrl || `https://localhost:${port}`,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: 'https://flaic.eu.auth0.com',
  clientSecret: process.env.CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code' ,
    //scope: "openid profile email"   
   },
};
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.get('/',  function (req, res) {
  let username : string | undefined;
  if(req.oidc.isAuthenticated()) {
    username = req.oidc.user?.name ?? req.oidc.user?.sub;
  }
  res.render('index', {username});
});

app.get('/create', requiresAuth(), function (req, res) {     
    res.render('create'); 
});

app.post('/insert-comp', requiresAuth(), function (req, res) {      
  const creator = req.oidc.user?.sub;
  let teams : string[] = [];
  (req.body?.teams.split(";") as string[]).forEach(a => a.split('\n').forEach(t => teams.push(t.trim())));
  const len : number = teams.length
  if(teams.length < 4 || teams.length > 8) {
    res.redirect('/create')
  } else {
    let name : string = req.body?.cname;
    let points : number[] = req.body?.points.split("/");
    let compId : number | undefined;
    let teamId : number | undefined;
    let teamIds : number[] = []
    insertCompetition(name, points, creator)
      .then(p => {
        compId = p?.valueOf();
        if(compId) {
          teams.forEach(team => insertTeam(team)
                                .then(p => {
                                  teamId = p?.valueOf();
                                  if(compId && teamId) {
                                    insertCompetitionTeam(compId, teamId)
                                    teamIds.push(teamId)
                                  }                             
                                })
                                .then(p => {
                                  if(teamIds.length == len) {
                                    if(compId && len == 4) {
                                      let date1 = new Date()
                                      date1.setDate(date1.getDate() + 1);
                                      insertMatch(compId, teamIds[1], teamIds[2], date1, 1)
                                      insertMatch(compId, teamIds[3], teamIds[0], date1, 1)
                                      let date2 = new Date()
                                      date2.setDate(date2.getDate() + 2);
                                      insertMatch(compId, teamIds[0], teamIds[1], date2, 2)
                                      insertMatch(compId, teamIds[2], teamIds[3], date2, 2)
                                      let date3 = new Date()
                                      date3.setDate(date3.getDate() + 3);
                                      insertMatch(compId, teamIds[3], teamIds[1], date3, 3)
                                      insertMatch(compId, teamIds[2], teamIds[0], date3, 3)
                                    } else if(compId && len == 5) {
                                      let date1 = new Date()
                                      date1.setDate(date1.getDate() + 1);
                                      insertMatch(compId, teamIds[1], teamIds[4], date1, 1)
                                      insertMatch(compId, teamIds[2], teamIds[3], date1, 1)
                                      let date2 = new Date()
                                      date2.setDate(date2.getDate() + 2);
                                      insertMatch(compId, teamIds[4], teamIds[2], date2, 2)
                                      insertMatch(compId, teamIds[0], teamIds[1], date2, 2)
                                      let date3 = new Date()
                                      date3.setDate(date3.getDate() + 3);
                                      insertMatch(compId, teamIds[2], teamIds[0], date3, 3)
                                      insertMatch(compId, teamIds[3], teamIds[2], date3, 3)
                                      let date4 = new Date()
                                      date4.setDate(date4.getDate() + 4);
                                      insertMatch(compId, teamIds[0], teamIds[3], date4, 4)
                                      insertMatch(compId, teamIds[1], teamIds[2], date4, 4)
                                      let date5 = new Date()
                                      date5.setDate(date5.getDate() + 5);
                                      insertMatch(compId, teamIds[3], teamIds[1], date5, 5)
                                      insertMatch(compId, teamIds[1], teamIds[0], date5, 5)
                                    } else if(compId && len == 6) {
                                      let date1 = new Date()
                                      date1.setDate(date1.getDate() + 1);
                                      insertMatch(compId, teamIds[5], teamIds[0], date1, 1)
                                      insertMatch(compId, teamIds[1], teamIds[4], date1, 1)
                                      insertMatch(compId, teamIds[2], teamIds[3], date1, 1)
                                      let date2 = new Date()
                                      date2.setDate(date2.getDate() + 2);
                                      insertMatch(compId, teamIds[4], teamIds[2], date2, 2)
                                      insertMatch(compId, teamIds[3], teamIds[5], date2, 2)
                                      insertMatch(compId, teamIds[0], teamIds[1], date2, 2)
                                      let date3 = new Date()
                                      date3.setDate(date3.getDate() + 3);
                                      insertMatch(compId, teamIds[3], teamIds[4], date3, 3)
                                      insertMatch(compId, teamIds[2], teamIds[0], date3, 3)
                                      insertMatch(compId, teamIds[5], teamIds[1], date3, 3)
                                      let date4 = new Date()
                                      date4.setDate(date4.getDate() + 4);
                                      insertMatch(compId, teamIds[1], teamIds[2], date4, 4)
                                      insertMatch(compId, teamIds[0], teamIds[3], date4, 4)
                                      insertMatch(compId, teamIds[4], teamIds[5], date4, 4)
                                      let date5 = new Date()
                                      date5.setDate(date5.getDate() + 5);
                                      insertMatch(compId, teamIds[3], teamIds[1], date5, 5)
                                      insertMatch(compId, teamIds[5], teamIds[2], date5, 5)
                                      insertMatch(compId, teamIds[4], teamIds[0], date5, 5)
                                    } else if(compId && len == 7) {
                                      let date1 = new Date()
                                      date1.setDate(date1.getDate() + 1);
                                      insertMatch(compId, teamIds[1], teamIds[6], date1, 1)
                                      insertMatch(compId, teamIds[2], teamIds[5], date1, 1)
                                      insertMatch(compId, teamIds[3], teamIds[4], date1, 1)
                                      let date2 = new Date()
                                      date2.setDate(date2.getDate() + 2);
                                      insertMatch(compId, teamIds[5], teamIds[3], date2, 2)
                                      insertMatch(compId, teamIds[6], teamIds[2], date2, 2)
                                      insertMatch(compId, teamIds[0], teamIds[1], date2, 2)
                                      let date3 = new Date()
                                      date3.setDate(date3.getDate() + 3);
                                      insertMatch(compId, teamIds[2], teamIds[0], date3, 3)
                                      insertMatch(compId, teamIds[3], teamIds[6], date3, 3)
                                      insertMatch(compId, teamIds[4], teamIds[5], date3, 3)
                                      let date4 = new Date()
                                      date4.setDate(date4.getDate() + 4);
                                      insertMatch(compId, teamIds[6], teamIds[4], date4, 4)
                                      insertMatch(compId, teamIds[0], teamIds[3], date4, 4)
                                      insertMatch(compId, teamIds[1], teamIds[2], date4, 4)
                                      let date5 = new Date()
                                      date5.setDate(date5.getDate() + 5);
                                      insertMatch(compId, teamIds[3], teamIds[1], date5, 5)
                                      insertMatch(compId, teamIds[4], teamIds[0], date5, 5)
                                      insertMatch(compId, teamIds[5], teamIds[6], date5, 5)
                                      let date6 = new Date()
                                      date6.setDate(date6.getDate() + 6);
                                      insertMatch(compId, teamIds[0], teamIds[5], date6, 6)
                                      insertMatch(compId, teamIds[1], teamIds[4], date6, 6)
                                      insertMatch(compId, teamIds[2], teamIds[3], date6, 6)
                                      let date7 = new Date()
                                      date7.setDate(date7.getDate() + 7);
                                      insertMatch(compId, teamIds[4], teamIds[2], date7, 7)
                                      insertMatch(compId, teamIds[5], teamIds[1], date7, 7)
                                      insertMatch(compId, teamIds[6], teamIds[0], date7, 7)
                                    } else if(compId && len == 8) {
                                      let date1 = new Date()
                                      date1.setDate(date1.getDate() + 1);
                                      insertMatch(compId, teamIds[7], teamIds[0], date1, 1)
                                      insertMatch(compId, teamIds[1], teamIds[6], date1, 1)
                                      insertMatch(compId, teamIds[2], teamIds[5], date1, 1)
                                      insertMatch(compId, teamIds[3], teamIds[4], date1, 1)
                                      let date2 = new Date()
                                      date2.setDate(date2.getDate() + 2);
                                      insertMatch(compId, teamIds[5], teamIds[3], date2, 2)
                                      insertMatch(compId, teamIds[4], teamIds[7], date2, 2)
                                      insertMatch(compId, teamIds[6], teamIds[2], date2, 2)
                                      insertMatch(compId, teamIds[0], teamIds[1], date2, 2)
                                      let date3 = new Date()
                                      date3.setDate(date3.getDate() + 3);
                                      insertMatch(compId, teamIds[3], teamIds[6], date3, 3)
                                      insertMatch(compId, teamIds[2], teamIds[0], date3, 3)
                                      insertMatch(compId, teamIds[7], teamIds[1], date3, 3)
                                      insertMatch(compId, teamIds[4], teamIds[5], date3, 3)
                                      let date4 = new Date()
                                      date4.setDate(date4.getDate() + 4);
                                      insertMatch(compId, teamIds[1], teamIds[2], date4, 4)
                                      insertMatch(compId, teamIds[6], teamIds[4], date4, 4)
                                      insertMatch(compId, teamIds[0], teamIds[3], date4, 4)
                                      insertMatch(compId, teamIds[5], teamIds[7], date4, 4)
                                      let date5 = new Date()
                                      date5.setDate(date5.getDate() + 5);
                                      insertMatch(compId, teamIds[5], teamIds[6], date5, 5)
                                      insertMatch(compId, teamIds[3], teamIds[1], date5, 5)
                                      insertMatch(compId, teamIds[4], teamIds[0], date5, 5)
                                      insertMatch(compId, teamIds[7], teamIds[2], date5, 5)
                                      let date6 = new Date()
                                      date6.setDate(date6.getDate() + 6);
                                      insertMatch(compId, teamIds[1], teamIds[4], date6, 6)
                                      insertMatch(compId, teamIds[0], teamIds[5], date6, 6)
                                      insertMatch(compId, teamIds[6], teamIds[7], date6, 6)
                                      insertMatch(compId, teamIds[2], teamIds[3], date6, 6)
                                      let date7 = new Date()
                                      date7.setDate(date7.getDate() + 7);
                                      insertMatch(compId, teamIds[4], teamIds[2], date7, 7)
                                      insertMatch(compId, teamIds[7], teamIds[3], date7, 7)
                                      insertMatch(compId, teamIds[5], teamIds[1], date7, 7)
                                      insertMatch(compId, teamIds[6], teamIds[0], date7, 7)
                                    }                          
                                  }
                                })
          )
        } else {
          res.redirect('/create')
        }
        res.redirect('/my-comps')
      })
  }
});

app.get('/my-comps', requiresAuth(), function (req, res) {       
  const creator : string = req.oidc.user?.sub; 
  const comps : Competition[] = [];
  getCompetitionsByCreator(creator)
    .then(p => p.forEach(c => comps.push(c)))
    .then(p => res.render('comps', {comps}));
});

app.get('/comp', requiresAuth(), function (req, res) {
  const currentUser : string = req.oidc.user?.sub
  const url : string = req.originalUrl  
  const compId : number = parseInt(req.url.split('?')[1].split('=')[1]);
  const matches : Match[] = [];
  const table : CompetitionTeam[] = [];
  let currentIsCreator = false
  getCompetitionById(compId)
    .then(p => {
      if(p.creator == currentUser) currentIsCreator = true;
    })
  getMatchesByCompetition(compId)
    .then(p => p.forEach(m => matches.push(m)))
    .then(p => getCompetitionTeamsById(compId))
      .then(p => p.forEach(t => table.push(t)))
    .then(p => res.render('comp', {matches, table, currentIsCreator, url}));
});

app.get('/match', requiresAuth(), function (req, res) {       
  const matchId : number = parseInt(req.url.split('?')[1].split('=')[1]);
  let  match : Match;
  getMatchById(matchId)
    .then(p => match = {id: p.id,
                        competitionId: p.competitionId,
                        competitionName: p.competitionName,
                        firstTeamId: p.firstTeamId,
                        firstTeamName: p.firstTeamName,
                        secondTeamId: p.secondTeamId,
                        secondTeamName : p.secondTeamName,
                        matchTime : p.matchTime,
                        firstTeamScore: p.firstTeamScore ?? undefined,
                        secondTeamScore: p.secondTeamScore ?? undefined,
                        round: p.round
    })
    .then(p => res.render('match', {match}));
});

app.post('/update-score', requiresAuth(), function(req, res) {
  const matchId : number = parseInt(req.url.split('?')[1].split('=')[1]);
  let firstTeamScore : number = req.body?.fts;
  let secondTeamScore : number = req.body?.sts;
  let winPts : number;
  let drawPts : number;
  let losePts : number;

  let ftw = false;
  let ftd = false;
  let ftl = false;
  let stw = false;
  let std = false;
  let stl = false;
  if(firstTeamScore == secondTeamScore) {
    ftd = std = true;
  } else if(firstTeamScore > secondTeamScore) {
    ftw = stl = true;
  } else {
    ftl = stw = true;
  }

  getMatchById(matchId)
    .then(m => {
      getCompetitionByName(m.competitionName).then(c => {
      winPts = c.winPoints;
      drawPts = c.drawPoints;
      losePts = c.losePoints;
      getCompetitionTeamByIds(m.competitionId, m.firstTeamId).then(t1 => {
        let wins1 = t1.wins ? t1.wins : 0
        let draws1 = t1.draws ? t1.draws : 0
        let loses1 = t1.loses ? t1.loses : 0
        let points1 = t1.points ? t1.points : 0
        if(ftw) {
          wins1 += 1
          points1 += winPts
        } else if(ftd) {
          draws1 += 1
          points1 += drawPts
        } else if(ftl) {
          loses1 += 1
          points1 += losePts
        }
        updateCompetitionTeam(m.competitionId, t1.teamId, wins1, draws1, loses1, points1)
      });
      getCompetitionTeamByIds(m.competitionId, m.secondTeamId).then(t2 => {
        let wins2 = t2.wins ? t2.wins : 0
        let draws2 = t2.draws ? t2.draws : 0
        let loses2 = t2.loses ? t2.loses : 0
        let points2 = t2.points ? t2.points : 0
        if(stw) {
          wins2 += 1
          points2 += winPts
        } else if(std) {
          draws2 += 1
          points2 += drawPts
        } else if(stl) {
          loses2 += 1
          points2 += losePts
        }
        updateCompetitionTeam(m.competitionId, t2.teamId, wins2, draws2, loses2, points2)
      });

    })
  })
  updateMatch(matchId, firstTeamScore, secondTeamScore)
    .then(p => res.redirect('/match?id='+matchId))
});

app.get("/login", (req, res) => {
  res.oidc.login({
    returnTo: '/',
    authorizationParams: {      
      screen_hint: "login",
    },
  });
});

app.get("/sign-up", (req, res) => {
  res.oidc.login({
    returnTo: '/',
    authorizationParams: {      
      screen_hint: "signup",
    },
  });
});

if(externalUrl) {
    const hostname = '0.0.0.0';
    app.listen(port, hostname, () => {
        console.log(`Server locally running at http://${hostname}:${port}/ and from outside on ${externalUrl}`)
    })
} else {
    https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
    }, app).listen(port, function () {
        console.log(`Server running at https://localhost:${port}/`);
    });
}

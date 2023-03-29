export class TinderApi {
  constructor(token) {
    this.token = token;
    this.authHeaders = {
      "X-Auth-Token": token,
      "content-type": "application/json",
      "User-agent": "Tinder/7.5.3 (iPhone; iOS 10.3.2; Scale/2.00)",
      "accept-language": "pt,pt-BR,en-US,en",
    };
  }
  static preAuthHeaders = {
    "content-type": "application/json",
    "User-agent": "Tinder/7.5.3 (iPhone; iOS 10.3.2; Scale/2.00)",
  };

  static sendCode = async (number) => {
    try {
      const response = await fetch(
        `https://api.gotinder.com/v2/auth/sms/send?auth_type=sms`,
        {
          method: "POST",
          body: JSON.stringify({
            phone_number: number,
          }),
          headers: TinderApi.preAuthHeaders,
        }
      );
      return await response.json();
    } catch (error) {
      return error;
    }
  };

  static getApiToken = async (code, number) => {
    try {
      const refresh_resp = await fetch(
        `https://api.gotinder.com/v2/auth/sms/validate?auth_type=sms`,
        {
          method: "POST",
          body: JSON.stringify({
            otp_code: code,
            phone_number: number,
          }),
          headers: TinderApi.preAuthHeaders,
        }
      );
      const refresh = await refresh_resp.json();
      const response = await fetch(
        `https://api.gotinder.com/v2/auth/login/sms`,
        {
          method: "POST",
          body: JSON.stringify({
            refresh_token: refresh.data.refresh_token,
          }),
          headers: TinderApi.preAuthHeaders,
        }
      );
      //response.data.api_token

      return await response.json();
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  getMatches = async () => {
    try {
      const matchRes = await fetch(
        `https://api.gotinder.com/v2/matches?count=100&is_tinder_u=false&locale=pt`,
        {
          method: "GET",
          headers: this.authHeaders,
        }
      );
      const res = await matchRes.json();
      return res.data.matches;
    } catch (e) {
      console.log(e);
      return;
    }
  };

  getSelf = async () => {
    try {
      const res = await fetch(
        "https://api.gotinder.com/v2/profile?locale=pt&include=account%2Cavailable_descriptors%2Cboost%2Cbouncerbypass%2Ccontact_cards%2Cemail_settings%2Cfeature_access%2Cinstagram%2Clikes%2Cprofile_meter%2Cnotifications%2Cmisc_merchandising%2Cofferings%2Conboarding%2Cplus_control%2Cpurchase%2Creadreceipts%2Cspotify%2Csuper_likes%2Ctinder_u%2Ctravel%2Ctutorials%2Cuser%2Cpaywalls",
        {
          headers: this.authHeaders,
          method: "GET",
        }
      );
      const response = await res.json();
      return response.data;
    } catch (e) {
      console.log(e);
      return;
    }
  };

  getProfile = async (match) => {
    try {
      const res = await fetch(
        `https://api.gotinder.com/user/${match.person._id}?locale=pt`,
        {
          method: "GET",
          headers: this.authHeaders,
        }
      );
      const profile = await res.json();
      return profile.results;
    } catch (e) {
      console.log("Something broke", e);
    }
  };

  sendMessage = async (match, message) => {
    try {
      const res = await fetch(
        `https://api.gotinder.com/user/matches/${match.id}`,
        {
          method: "post",
          body: JSON.stringify({
            message: message,
          }),
          headers: this.authHeaders,
        }
      );
      const response = await res.json();
      return response;
    } catch (e) {
      console.log("Erro ao enviar mensagem:", e);
    }
  };

  unmatch = async (match) => {
    try {
      const res = await fetch(
        `https://api.gotinder.com/user/matches/${match._id}`,
        {
          method: "delete",
          headers: headers,
        }
      );
      return await res.json();
    } catch (e) {
      console.log("Something broke", e);
    }
  };

  getMessages = async (match) => {
    try {
      const res = await fetch(
        `https://api.gotinder.com/v2/matches/${match._id}/messages?locale=pt&count=40`,
        {
          headers: this.authHeaders,
        }
      );
      // console.log(res);
      const json = await res.json();
      return json.data.messages;
    } catch (e) {
      console.log("Something broke", e);
    }
  };

  like = async (id) => {
    try {
      const res = await fetch(`https://api.gotinder.com/like/${id}?locale=pt`, {
        headers: this.authHeaders,
      });
      const json = await res.json();
      return {
        status: json.status,
        match: json.match,
        likes_remaining: json.likes_remaining,
      };
    } catch (e) {
      console.log("Something broke", e);
    }
  };
}

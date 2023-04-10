export class TinderApi {
  constructor(token = null, accepted_languages = "en-US") {
    this.base_url = "https://api.gotinder.com/";
    this.locale = accepted_languages.split(",")[0].split("-")[0];
    this.token = token;
    this.headers = {
      "content-type": "application/json",
      "User-agent": "Tinder/7.5.3 (iPhone; iOS 10.3.2; Scale/2.00)",
      "accept-language": `${accepted_languages}`,
    };
  }

  preAuthReq = async (path, body = {}) => {
    const response = await fetch(
      `${this.base_url}${path}?locale=${this.locale}`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: this.headers,
      }
    );
    if (response.status >= 200 && response.status < 300) {
      return await response.json();
    } else {
      throw response.status;
    }
  };

  fetchData = async (path) => {
    const response = await fetch(`${this.base_url}${path}`, {
      method: "GET",
      headers: { "X-Auth-Token": this.token, ...this.headers },
    });
    if (response.status >= 200 && response.status < 300) {
      return await response.json();
    } else {
      throw response.status;
    }
  };

  postData = async (path, body) => {
    const response = await fetch(`${this.base_url}${path}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "X-Auth-Token": this.token, ...this.headers },
    });
    if (response.status >= 200 && response.status < 300) {
      return await response.json();
    } else {
      throw response.status;
    }
  };

  sendCode = async (number) => {
    return await this.preAuthReq(`v2/auth/sms/send?auth_type=sms`, {
      phone_number: number,
    });
  };

  getApiToken = async (code, number) => {
    const refresh = await this.preAuthReq(
      `v2/auth/sms/validate?auth_type=sms`,
      {
        otp_code: code,
        phone_number: number,
      }
    );
    return await this.preAuthReq(`v2/auth/login/sms`, {
      refresh_token: refresh.data.refresh_token,
    });
  };

  getMatches = async (next_page_token = null) => {
    const res = await this.fetchData(
      `v2/matches?count=100&is_tinder_u=false&locale=${this.locale}${
        next_page_token ? "&page_token=" + next_page_token : ""
      }`
    );
    return res.data;
  };

  getSelf = async () => {
    const res = await this.fetchData(
      `v2/profile?locale=${this.locale}&include=account%2Cavailable_descriptors%2Cboost%2Cbouncerbypass%2Ccontact_cards%2Cemail_settings%2Cfeature_access%2Cinstagram%2Clikes%2Cprofile_meter%2Cnotifications%2Cmisc_merchandising%2Cofferings%2Conboarding%2Cplus_control%2Cpurchase%2Creadreceipts%2Cspotify%2Csuper_likes%2Ctinder_u%2Ctravel%2Ctutorials%2Cuser%2Cpaywalls`
    );
    return res.data;
  };

  getProfile = async (person_id) => {
    const res = await this.fetchData(`user/${person_id}?locale=${this.locale}`);
    return res.results;
  };

  getMessages = async (match_id) => {
    const res = await this.fetchData(
      `v2/matches/${match_id}/messages?locale=${this.locale}&count=20`
    );
    return res.data.messages;
  };

  sendMessage = async (match_id, message) => {
    return await this.postData(`user/matches/${match_id}`, {
      message: message,
    });
  };
}

//   like = async (id) => {
//     try {
//       const res = await fetch(
//         `https://api.gotinder.com/like/${id}?locale=${this.locale}`,
//         {
//           headers: this.authHeaders,
//         }
//       );
//       const json = await res.json();
//       return {
//         status: json.status,
//         match: json.match,
//         likes_remaining: json.likes_remaining,
//       };
//     } catch (e) {
//       console.log("Something broke", e);
//     }
//   };
// }

//   unmatch = async (match) => {
//     try {
//       const res = await fetch(
//         `https://api.gotinder.com/user/matches/${match._id}`,
//         {
//           method: "delete",
//           headers: headers,
//         }
//       );
//       return await res.json();
//     } catch (e) {
//       console.log("Something broke", e);
//     }

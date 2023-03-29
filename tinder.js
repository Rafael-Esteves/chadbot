const token = "";

const authHeaders = {
  "X-Auth-Token": token,
  "content-type": "application/json",
  "User-agent": "Tinder/7.5.3 (iPhone; iOS 10.3.2; Scale/2.00)",
  "accept-language": "pt,pt-BR,en-US,en",
};

const preAuthHeaders = {
  "content-type": "application/json",
  "User-agent": "Tinder/7.5.3 (iPhone; iOS 10.3.2; Scale/2.00)",
};

const fetchData = async (url, method = "GET", body, headers = authHeaders) => {
  try {
    console.log("headers", headers);
    console.log("body", body);
    const res = await fetch(`https://api.gotinder.com/${url}`, {
      method,
      body,
      headers: headers,
    });
    return await res.json();
  } catch (e) {
    console.log("Something broke", e);
  }
};

export const sendCode = async (number) => {
  try {
    console.log(number);
    const response = await fetchData(
      `v2/auth/sms/send?auth_type=sms`,
      "POST",
      {
        phone_number: number,
      },
      preAuthHeaders
    );
    console.log(response);
  } catch (error) {
    console.log(error);
    alert("An error has occurred.");
  }
};

const validateCode = async (code, number) => {
  try {
    const data = {
      otp_code: code,
      phone_number: number,
    };
    const response = await fetchData(
      `v2/auth/sms/validate?auth_type=sms`,
      "POST",
      data,
      preAuthHeaders
    );
    if (response.status === 200) {
      if (response.data.data.validated) {
        return response.data.data.refresh_token;
      } else {
        alert("An error has occurred on refresh token.");
      }
    } else {
      throw new Error("An error has occurred with the status");
    }
  } catch (error) {
    console.log(error);
    alert("An error has occurred on validate code.");
  }
};

export const getApiToken = async (code, number) => {
  try {
    const refresh_token = await validateCode(code, number);
    const response = await fetchData(
      `v2/auth/login/sms`,
      {
        refresh_token: refresh_token,
      },
      { headers: preAuthHeaders }
    );
    if (response.status === 200) {
      if (response.data.data.api_token) {
        localStorage.setItem(
          "tinder_api_key",
          JSON.stringify(response.data.data.api_token)
        );
      } else {
        alert("An error has occurred on refresh token.");
      }
    } else {
      throw new Error("An error has occurred with the api token");
    }
  } catch (error) {
    console.log(error);
    alert("An error has occurred on get api token.");
  }
};

export const getMatches = async () => {
  try {
    const matchRes = (await fetchData(
      `v2/matches?count=100&is_tinder_u=false&locale=pt`
    )) || { data: { matches: [] } };

    return matchRes.data.matches;
  } catch (e) {
    console.log(e);
    return;
  }
};

export const getProfile = async (match) => {
  try {
    const res = await fetch(
      `https://api.gotinder.com/user/${match.person._id}?locale=pt`,
      {
        method: "GET",
        headers: headers,
      }
    );
    const profile = await res.json();
    return profile.results;
  } catch (e) {
    console.log("Something broke", e);
  }
};

export const sendMessage = async (match, message) => {
  try {
    const res = await fetch(
      `https://api.gotinder.com/user/matches/${match.id}`,
      {
        method: "post",
        body: JSON.stringify({
          message: message,
        }),
        headers: headers,
      }
    );
    const response = await res.json();
    return response;
  } catch (e) {
    console.log("Erro ao enviar mensagem:", e);
  }
};

export const unmatch = async (match) => {
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

export const getMessages = async (match) => {
  try {
    const res = await fetch(
      `https://api.gotinder.com/v2/matches/${match._id}/messages?locale=pt&count=40`,
      {
        headers: headers,
      }
    );
    // console.log(res);
    const json = await res.json();
    return json.data.messages;
  } catch (e) {
    console.log("Something broke", e);
  }
};

export const like = async (id) => {
  try {
    const res = await fetch(`https://api.gotinder.com/like/${id}?locale=pt`, {
      headers: headers,
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

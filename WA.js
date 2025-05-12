//初始化API
async function initAPI() {
  window["Store"] = Object["assign"]({}, window["require"]("WAWebCollections"));
  window["Store"]["AppState"] = window["require"]("WAWebSocketModel")["Socket"];
  window["Store"]["BlockContact"] = window["require"](
    "WAWebBlockContactAction"
  );
  window["Store"]["Conn"] = window["require"]("WAWebConnModel")["Conn"];
  window["Store"]["Cmd"] = window["require"]("WAWebCmd")["Cmd"];
  window["Store"]["DownloadManager"] = window["require"](
    "reganaMdaolnwoDbeWAW".split("").reverse().join("")
  )["downloadManager"];
  window["Store"]["GroupQueryAndUpdate"] =
    window["require"]("WAWebGroupQueryJob")["queryAndUpdateGroupMetadataById"];
  window["Store"]["MediaPrep"] = window["require"](
    "aideMwaRperPbeWAW".split("").reverse().join("")
  );
  window["Store"]["MediaObject"] = window["require"]("WAWebMediaStorage");
  window["Store"]["MediaTypes"] = window["require"]("WAWebMmsMediaTypes");
  window["Store"]["MediaUpload"] = window["require"]("WAWebMediaMmsV4Upload");
  window["Store"]["MsgKey"] = window["require"](
    "yeKgsMbeWAW".split("").reverse().join("")
  );
  window["Store"]["NumberInfo"] = window["require"]("WAPhoneUtils");
  window["Store"]["OpaqueData"] = window["require"]("WAWebMediaOpaqueData");
  window["Store"]["QueryProduct"] = window["require"](
    "egdirBgolataCtcudorPziBbeWAW".split("").reverse().join("")
  );
  window["Store"]["QueryOrder"] = window["require"](
    "egdirBredrOziBbeWAW".split("").reverse().join("")
  );
  window["Store"]["SendClear"] = window["require"]("WAWebChatClearBridge");
  window["Store"]["SendDelete"] = window["require"]("WAWebDeleteChatAction");
  window["Store"]["SendMessage"] = window["require"]("WAWebSendMsgChatAction");
  window["Store"]["EditMessage"] = window["require"](
    "WAWebSendMessageEditAction"
  );
  window["Store"]["SendSeen"] = window["require"](
    "WAWebUpdateUnreadChatAction"
  );
  window["Store"]["User"] = window["require"]("WAWebUserPrefsMeUser");
  window["Store"]["ContactMethods"] = window["require"]("WAWebContactGetters");
  window["Store"]["UploadUtils"] = window["require"](
    "reganaMdaolpUbeWAW".split("").reverse().join("")
  );
  window["Store"]["UserConstructor"] = window["require"](
    "diWbeWAW".split("").reverse().join("")
  );
  window["Store"]["Validators"] = window["require"]("WALinkify");
  window["Store"]["VCard"] = window["require"]("WAWebFrontendVcardUtils");
  window["Store"]["WidFactory"] = window["require"]("WAWebWidFactory");
  window["Store"]["ProfilePic"] = window["require"](
    "egdirBbmuhTciPeliforPtcatnoCbeWAW".split("").reverse().join("")
  );
  window["Store"]["PresenceUtils"] = window["require"](
    "noitcAtahCecneserPbeWAW".split("").reverse().join("")
  );
  window["Store"]["ChatState"] = window["require"]("WAWebChatStateBridge");
  window["Store"]["findCommonGroups"] = window["require"](
    "WAWebFindCommonGroupsContactAction"
  )["findCommonGroups"];
  window["Store"]["StatusUtils"] = window["require"](
    "egdirBsutatStcatnoCbeWAW".split("").reverse().join("")
  );
  window["Store"]["ConversationMsgs"] = window["require"](
    "segasseMdaoLtahCbeWAW".split("").reverse().join("")
  );
  window["Store"]["sendReactionToMsg"] = window["require"](
    "WAWebSendReactionMsgAction"
  )["sendReactionToMsg"];
  window["Store"]["createOrUpdateReactionsModule"] = window["require"](
    "WAWebDBCreateOrUpdateReactions"
  );
  window["Store"]["EphemeralFields"] = window["require"](
    "WAWebGetEphemeralFieldsMsgActionsUtils"
  );
  window["Store"]["MsgActionChecks"] = window["require"](
    "ytilibapaCnoitcAgsMbeWAW".split("").reverse().join("")
  );
  window["Store"]["QuotedMsg"] = window["require"](
    "slitUledoMgsMdetouQbeWAW".split("").reverse().join("")
  );
  window["Store"]["LinkPreview"] = window["require"](
    "WAWebLinkPreviewChatAction"
  );
  window["Store"]["Socket"] = window["require"](
    "qIdneSdetacerpeDAW".split("").reverse().join("")
  );
  window["Store"]["SocketWap"] = window["require"]("WAWap");
  window["Store"]["SearchContext"] = window["require"](
    "hcraeSegasseMtahCbeWAW".split("").reverse().join("")
  )["getSearchContext"];
  window["Store"]["DrawerManager"] =
    window["require"]("WAWebDrawerManager")["DrawerManager"];
  window["Store"]["LidUtils"] = window["require"]("WAWebApiContact");
  window["Store"]["WidToJid"] = window["require"](
    "diJoTdiWbeWAW".split("").reverse().join("")
  );
  window["Store"]["JidToWid"] = window["require"](
    "diWoTdiJbeWAW".split("").reverse().join("")
  );
  window["Store"]["getMsgInfo"] = window["require"]("WAWebApiMessageInfoStore")[
    "queryMsgInfo"
  ];
  window["Store"]["pinUnpinMsg"] = window["require"](
    "noitcAegasseMniPdneSbeWAW".split("").reverse().join("")
  )["sendPinInChatMsg"];
  window["Store"]["QueryExist"] = window["require"]("WAWebQueryExistsJob")[
    "queryWidExists"
  ];
  window["Store"]["ReplyUtils"] = window["require"]("WAWebMsgReply");
  window["Store"]["Settings"] = window["require"]("WAWebUserPrefsGeneral");
  window["Store"]["BotSecret"] = window["require"](
    "terceSegasseMtoBbeWAW".split("").reverse().join("")
  );
  window["Store"]["BotProfiles"] = window["require"](
    "WAWebBotProfileCollection"
  );
  window["Store"]["ForwardUtils"] = {
    ...window["require"]("WAWebForwardMessagesToChat"),
  };
  window["Store"]["StickerTools"] = {
    ...window["require"]("slitUegamIbeWAW".split("").reverse().join("")),
    ...window["require"]("WAWebAddWebpMetadata"),
  };
  window["Store"]["GroupUtils"] = {
    ...window["require"]("WAWebGroupCreateJob"),
    ...window["require"](
      "boJofnIyfidoMpuorGbeWAW".split("").reverse().join("")
    ),
    ...window["require"]("WAWebExitGroupAction"),
    ...window["require"]("WAWebContactProfilePicThumbBridge"),
  };
  window["Store"]["GroupParticipants"] = {
    ...window["require"](
      "noitcApuorGstnapicitraPyfidoMbeWAW".split("").reverse().join("")
    ),
    ...window["require"](
      "CPRstnapicitraPddAspuorGxamSAW".split("").reverse().join("")
    ),
  };
  window["Store"]["GroupInvite"] = {
    ...window["require"]("WAWebGroupInviteJob"),
    ...window["require"]("WAWebGroupQueryJob"),
  };
  window["Store"]["GroupInviteV4"] = {
    ...window["require"]("WAWebGroupInviteV4Job"),
    ...window["require"]("segasseMdneStahCbeWAW".split("").reverse().join("")),
  };
  window["Store"]["MembershipRequestUtils"] = {
    ...window["require"](
      "erotStseuqeRlavorppApihsrebmeMipAbeWAW".split("").reverse().join("")
    ),
    ...window["require"](
      "CPRnoitcAstseuqeRpihsrebmeMspuorGxamSAW".split("").reverse().join("")
    ),
  };
  if (
    !window["Store"]["Chat"]["_find"] ||
    !window["Store"]["Chat"]["findImpl"]
  ) {
    window["Store"]["Chat"]["_find"] = (_0x59180e) => {
      const _0x10e010 = window["Store"]["Chat"]["get"](_0x59180e);
      return _0x10e010
        ? Promise["resolve"](_0x10e010)
        : Promise["resolve"]({
            id: _0x59180e,
          });
    };
    window["Store"]["Chat"]["findImpl"] = window["Store"]["Chat"]["_find"];
  }
}

const compareWwebVersions = (_0x83bd57, _0x5aca95, _0x598b90) => {
  //比较版本号

  if (
    ![">", ">=", "<", "=<".split("").reverse().join(""), "="]["includes"](
      _0x5aca95
    )
  ) {
    throw new (class _0x24d6d0 extends Error {
      constructor(_0x23542b) {
        super(_0x23542b);
        this["name"] = _0x56cd24(
          0x470,
          "kyk$".split("").reverse().join(""),
          0x34b,
          0x5b8,
          0x523
        );
      }
    })(_0x356a6e(0x198, 0x1c8, 0x3e9, 0x1a5, 0x12d));
  }
};

async function getContacts() {
  //获取所有联系人
  const _0x5764d5 = window["Store"]["Contact"]["getModelsArray"]();
  const _0x192983 = _0x5764d5["filter"](
    (_0x35871a) =>
      _0x35871a["id"]["user"] !== "0" &&
      _0x35871a["id"]["server"] !== "lid" &&
      _0x35871a["id"]["server"] !== "rettelswen".split("").reverse().join("")
  )["map"](async (_0x10d590) => getContactModel(_0x10d590));
  return await Promise["all"](_0x192983);
} //

async function getInviteCode(_0x18dac2) {
  //获取群组邀请链接
  const _0x51f903 = window["Store"]["WidFactory"]["createWid"](_0x18dac2);
  try {
    return await window["Store"]["GroupInvite"]["queryGroupInviteCode"](
      _0x51f903,
      !![]
    );
  } catch (_0x424eff) {
    if (_0x424eff)
      return {
        code: "",
      };
    throw _0x424eff;
  }
}

async function getContactModel(_0x585497) {
  //获取联系人模型
  let _0x534eed = _0x585497["serialize"]();
  _0x534eed["isBusiness"] =
    _0x585497["isBusiness"] === undefined ? ![] : _0x585497["isBusiness"];
  if (_0x585497["businessProfile"]) {
    _0x534eed["businessProfile"] = _0x585497["businessProfile"]["serialize"]();
  }
  const _0x52de0d = compareWwebVersions(
    window["Debug"]["VERSION"],
    "<",
    "2.2327.4"
  );
  _0x534eed["isMe"] = _0x52de0d
    ? _0x585497["isMe"]
    : window["Store"]["ContactMethods"]["getIsMe"](_0x585497);
  _0x534eed["isUser"] = _0x52de0d
    ? _0x585497["isUser"]
    : window["Store"]["ContactMethods"]["getIsUser"](_0x585497);
  _0x534eed["isGroup"] = _0x52de0d
    ? _0x585497["isGroup"]
    : window["Store"]["ContactMethods"]["getIsGroup"](_0x585497);
  _0x534eed["isWAContact"] = _0x52de0d
    ? _0x585497["isWAContact"]
    : window["Store"]["ContactMethods"]["getIsWAContact"](_0x585497);
  _0x534eed["isMyContact"] = _0x52de0d
    ? _0x585497["isMyContact"]
    : window["Store"]["ContactMethods"]["getIsMyContact"](_0x585497);
  _0x534eed["isBlocked"] = _0x585497["isContactBlocked"];
  _0x534eed["userid"] = _0x52de0d
    ? _0x585497["userid"]
    : window["Store"]["ContactMethods"]["getUserid"](_0x585497)
    ? window["Store"]["ContactMethods"]["getUserid"](_0x585497)
    : _0x585497["id"]["user"];
  _0x534eed["isEnterprise"] = _0x52de0d
    ? _0x585497["isEnterprise"]
    : window["Store"]["ContactMethods"]["getIsEnterprise"](_0x585497);
  _0x534eed["verifiedName"] = _0x52de0d
    ? _0x585497["verifiedName"]
    : window["Store"]["ContactMethods"]["getVerifiedName"](_0x585497);
  _0x534eed["verifiedLevel"] = _0x52de0d
    ? _0x585497["verifiedLevel"]
    : window["Store"]["ContactMethods"]["getVerifiedLevel"](_0x585497);
  _0x534eed["statusMute"] = _0x52de0d
    ? _0x585497["statusMute"]
    : window["Store"]["ContactMethods"]["getStatusMute"](_0x585497);
  _0x534eed["name"] = _0x52de0d
    ? _0x585497["name"]
    : window["Store"]["ContactMethods"]["getName"](_0x585497)
    ? window["Store"]["ContactMethods"]["getName"](_0x585497)
    : window["Store"]["ContactMethods"]["getVerifiedName"](_0x585497)
    ? window["Store"]["ContactMethods"]["getVerifiedName"](_0x585497)
    : window["Store"]["ContactMethods"]["getPushname"](_0x585497)
    ? window["Store"]["ContactMethods"]["getPushname"](_0x585497)
    : window["Store"]["NumberInfo"]["formatPhone"](_0x585497["id"]["user"]);
  _0x534eed["shortName"] = _0x52de0d
    ? _0x585497["shortName"]
    : window["Store"]["ContactMethods"]["getShortName"](_0x585497);
  _0x534eed["pushname"] = _0x52de0d
    ? _0x585497["pushname"]
    : window["Store"]["ContactMethods"]["getPushname"](_0x585497);
  _0x534eed["phone"] = !_0x534eed["isGroup"]
    ? _0x52de0d
      ? _0x585497["userid"]
      : window["Store"]["NumberInfo"]["formatPhone"](_0x585497["id"]["user"])
    : "";
  return _0x534eed;
}

const getChatModel = async (_0x3de946) => {
  //获取聊天模型
  let _0x502b0b = _0x3de946["serialize"]();
  _0x502b0b["isGroup"] = _0x3de946["isGroup"];
  _0x502b0b["formattedTitle"] = _0x3de946["formattedTitle"];
  _0x502b0b["isMuted"] = _0x3de946["mute"] && _0x3de946["mute"]["isMuted"];
  if (_0x3de946["groupMetadata"]) {
    const _0x5506ca = window["Store"]["WidFactory"]["createWid"](
      _0x3de946["id"]["_serialized"]
    );
    await window["Store"]["GroupMetadata"]["update"](_0x5506ca);
    _0x502b0b["groupMetadata"] = _0x3de946["groupMetadata"]["serialize"]();
  }
  _0x502b0b["chatId"] = _0x3de946["id"]["_serialized"];
  _0x502b0b["phone"] = !_0x502b0b["isGroup"]
    ? window["Store"]["NumberInfo"]["formatPhone"](_0x3de946["id"]["user"])
    : "";
  _0x502b0b["lastMessage"] = null;
  if (_0x502b0b["msgs"] && _0x502b0b["msgs"]["length"]) {
    const _0x1eedca = _0x3de946["lastReceivedKey"]
      ? window["Store"]["Msg"]["get"](
          _0x3de946["lastReceivedKey"]["_serialized"]
        )
      : null;
    if (_0x1eedca) {
      _0x502b0b["lastMessage"] = getMessageModel(_0x1eedca);
    }
  }
  delete _0x502b0b["msgs"];
  delete _0x502b0b["msgUnsyncedButtonReplyMsgs"];
  delete _0x502b0b["unsyncedButtonReplies"];
  return _0x502b0b;
};

const getMessageModel = (_0x3de5db) => {
  //获取消息模型
  const _0x49fa29 = _0x3de5db["serialize"]();
  _0x49fa29["isEphemeral"] = _0x3de5db["isEphemeral"];
  _0x49fa29["isStatusV3"] = _0x3de5db["isStatusV3"];
  _0x49fa29["links"] = window["Store"]["Validators"]
    ["findLinks"](
      _0x3de5db["mediaObject"] ? _0x3de5db["caption"] : _0x3de5db["body"]
    )
    ["map"]((_0x510506) => ({
      link: _0x510506["href"],
      isSuspicious: Boolean(
        _0x510506["suspiciousCharacters"] &&
          _0x510506["suspiciousCharacters"]["size"]
      ),
    }));
  if (_0x49fa29["buttons"]) {
    _0x49fa29["buttons"] = _0x49fa29["buttons"]["serialize"]();
  }
  if (_0x49fa29["dynamicReplyButtons"]) {
    _0x49fa29["dynamicReplyButtons"] = JSON["parse"](
      JSON["stringify"](_0x49fa29["dynamicReplyButtons"])
    );
  }

  if (_0x49fa29["replyButtons"]) {
    _0x49fa29["replyButtons"] = JSON["parse"](
      JSON["stringify"](_0x49fa29["replyButtons"])
    );
  }

  delete _0x49fa29["pendingAckUpdate"];
  return _0x49fa29;
};

function timestampToTime(_0xcc5de4) {
  //时间戳转换为时间
  const _0x339db8 = new Date(_0xcc5de4 * (0x4b53a ^ 0x4b6d2));
  const _0x164040 = _0x339db8["getFullYear"]();
  const _0x2c5fa3 = ("0" + (_0x339db8["getMonth"]() + (0x1ab0e ^ 0x1ab0f)))[
    "slice"
  ](-(0xb0385 ^ 0xb0387));
  const _0x48a489 = ("0" + _0x339db8["getDate"]())["slice"](
    -(0xc4f04 ^ 0xc4f06)
  );
  const _0x4047dd = ("0" + _0x339db8["getHours"]())["slice"](
    -(0xe6d99 ^ 0xe6d9b)
  );
  const _0xcfc88f = ("0" + _0x339db8["getMinutes"]())["slice"](
    -(0x93f7d ^ 0x93f7f)
  );
  const _0x1eb7d4 = ("0" + _0x339db8["getSeconds"]())["slice"](
    -(0x64730 ^ 0x64732)
  );
  return (
    _0x164040 +
    "-" +
    _0x2c5fa3 +
    "-" +
    _0x48a489 +
    " " +
    _0x4047dd +
    ":" +
    _0xcfc88f +
    ":" +
    _0x1eb7d4
  );
}

window["openChatWindow"] = async function (_0x5ee4f4) {
  //打开聊天窗口
  const _0x179799 = window["Store"]["WidFactory"]["createWid"](_0x5ee4f4);
  const _0xba3b82 =
    window["Store"]["Chat"]["get"](_0x179799) ||
    (await window["Store"]["Chat"]["find"](_0x179799));
  await window["Store"]["Cmd"]["openChatBottom"](_0xba3b82);
  setTimeout(() => {
    let _0x289b3f = document["querySelector"](
      'div[class="x1hx0egp x6ikm8r x1odjw0f x1k6rcq7 x6prxxf"]'
    );
    _0x289b3f["focus"]();
  }, 0x22b54 ^ 0x228bc);
};

window["exportChatMsgs"] = async function (_0x2b5706) {
  //导出聊天记录
  let _0x6b121a = await window["Store"]["Chat"]["get"](_0x2b5706);
  if (_0x6b121a) {
    let _0x59a2ad = _0x6b121a["msgs"]["getModelsArray"]();
    let _0x55d14c = await window["Store"]["ConversationMsgs"][
      "loadEarlierMsgs"
    ](_0x6b121a);
    let _0x3732ab = [];
    let _0x6bbf2 = [];
    if (_0x59a2ad && _0x59a2ad["length"] > (0xb598f ^ 0xb598f)) {
      for (let _0x6b3594 of _0x59a2ad) {
        let _0x1ff36c = timestampToTime(_0x6b3594["t"]);
        const _0x3f3d98 = await window["Store"]["Contact"]["find"](
          _0x6b3594["from"]
        );
        const _0x11031a = await window["Store"]["Contact"]["find"](
          _0x6b3594["to"]
        );
        let _0xd92ead = await getContactModel(_0x3f3d98);
        let _0x4429d4 = await getContactModel(_0x11031a);
        let _0x5dda12 = "";
        let _0x435eb1 = "";
        if (_0x6b3594["type"] === "tahc".split("").reverse().join("")) {
          _0x5dda12 = "息消本文".split("").reverse().join("");
          _0x435eb1 = _0x6b3594["body"];
        } else if (_0x6b3594["type"] === "oediv".split("").reverse().join("")) {
          _0x5dda12 = "息消频视".split("").reverse().join("");
          _0x435eb1 = _0x6b3594["caption"] ? _0x6b3594["caption"] : "";
        } else if (_0x6b3594["type"] === "image") {
          _0x5dda12 = "图片消息";
          _0x435eb1 = _0x6b3594["caption"] ? _0x6b3594["caption"] : "";
        } else if (
          _0x6b3594["type"] === "rekcits".split("").reverse().join("")
        ) {
          _0x5dda12 = "贴纸消息";
        } else if (_0x6b3594["type"] === "multi_vcard") {
          _0x5dda12 = "息消片名".split("").reverse().join("");
          _0x435eb1 =
            ":称名片名".split("").reverse().join("") +
            _0x6b3594["vcardFormattedName"];
        } else if (_0x6b3594["type"] === "dracv".split("").reverse().join("")) {
          _0x5dda12 = "名片消息";
          _0x435eb1 = "名片名称:" + _0x6b3594["vcardFormattedName"];
        } else if (_0x6b3594["type"] === "poll_creation") {
          _0x5dda12 = "投票消息";
          _0x435eb1 =
            ":称名票投".split("").reverse().join("") +
            _0x6b3594["pollName"] +
            "投票内容:" +
            JSON["stringify"](_0x6b3594["pollOptions"]);
        } else if (
          _0x6b3594["type"] === "noitacol".split("").reverse().join("")
        ) {
          _0x5dda12 = "息消置位".split("").reverse().join("");
          _0x435eb1 =
            "经度:" +
            _0x6b3594["lat"] +
            ":度纬".split("").reverse().join("") +
            _0x6b3594["lng"];
        } else if (_0x6b3594["type"] === "document") {
          _0x5dda12 = "息消件文".split("").reverse().join("");
          _0x435eb1 = _0x6b3594["caption"] ? _0x6b3594["caption"] : "";
        } else if (_0x6b3594["type"] === "ptt") {
          _0x5dda12 = "息消音语".split("").reverse().join("");
        } else if (
          _0x6b3594["type"] === "dekover".split("").reverse().join("")
        ) {
          _0x5dda12 = "息消的销撤".split("").reverse().join("");
        } else {
          _0x5dda12 = "息消知未".split("").reverse().join("");
        }
        _0x3732ab["push"]({
          id: _0x6b3594["id"]["id"],
          from: _0xd92ead["name"],
          fromPhone: _0xd92ead["phone"],
          to: _0x4429d4["name"],
          toPhone: _0x4429d4["phone"],
          type: _0x5dda12,
          message: _0x435eb1
            ? _0x435eb1
            : "本文息消无".split("").reverse().join(""),
          time: _0x1ff36c,
        });
      }
    }
    if (_0x55d14c && _0x55d14c["length"] > (0x8d63d ^ 0x8d63d)) {
      for (let _0x3daac1 of _0x55d14c) {
        let _0x581c16 = timestampToTime(_0x3daac1["t"]);
        const _0x48b8f1 = await window["Store"]["Contact"]["find"](
          _0x3daac1["from"]
        );
        const _0x2dabf6 = await window["Store"]["Contact"]["find"](
          _0x3daac1["to"]
        );
        let _0x2a49f7 = await getContactModel(_0x48b8f1);
        let _0x55e1c6 = await getContactModel(_0x2dabf6);
        let _0x3ad849 = "";
        let _0x144395 = "";
        if (_0x3daac1["type"] === "tahc".split("").reverse().join("")) {
          _0x3ad849 = "文本消息";
          _0x144395 = _0x3daac1["body"];
        } else if (_0x3daac1["type"] === "video") {
          _0x3ad849 = "视频消息";
          _0x144395 = _0x3daac1["caption"] ? _0x3daac1["caption"] : "";
        } else if (_0x3daac1["type"] === "egami".split("").reverse().join("")) {
          _0x3ad849 = "图片消息";
          _0x144395 = _0x3daac1["caption"] ? _0x3daac1["caption"] : "";
        } else if (_0x3daac1["type"] === "sticker") {
          _0x3ad849 = "息消纸贴".split("").reverse().join("");
        } else if (_0x3daac1["type"] === "multi_vcard") {
          _0x3ad849 = "息消片名".split("").reverse().join("");
          _0x144395 = "名片名称:" + _0x3daac1["vcardFormattedName"];
        } else if (_0x3daac1["type"] === "vcard") {
          _0x3ad849 = "名片消息";
          _0x144395 =
            ":称名片名".split("").reverse().join("") +
            _0x3daac1["vcardFormattedName"];
        } else if (_0x3daac1["type"] === "poll_creation") {
          _0x3ad849 = "息消票投".split("").reverse().join("");
          _0x144395 =
            "投票名称:" +
            _0x3daac1["pollName"] +
            ":容内票投".split("").reverse().join("") +
            JSON["stringify"](_0x3daac1["pollOptions"]);
        } else if (
          _0x3daac1["type"] === "noitacol".split("").reverse().join("")
        ) {
          _0x3ad849 = "息消置位".split("").reverse().join("");
          _0x144395 =
            "经度:" +
            _0x3daac1["lat"] +
            ":度纬".split("").reverse().join("") +
            _0x3daac1["lng"];
        } else if (
          _0x3daac1["type"] === "tnemucod".split("").reverse().join("")
        ) {
          _0x3ad849 = "息消件文".split("").reverse().join("");
          _0x144395 = _0x3daac1["caption"] ? _0x3daac1["caption"] : "";
        } else if (_0x3daac1["type"] === "ptt") {
          _0x3ad849 = "息消音语".split("").reverse().join("");
        } else if (_0x3daac1["type"] === "revoked") {
          _0x3ad849 = "撤销的消息";
        } else {
          _0x3ad849 = "未知消息";
        }
        _0x6bbf2["push"]({
          id: _0x3daac1["id"]["id"],
          from: _0x2a49f7["name"],
          fromPhone: _0x2a49f7["phone"],
          to: _0x55e1c6["name"],
          toPhone: _0x55e1c6["phone"],
          type: _0x3ad849,
          message: _0x144395,
          time: _0x581c16,
        });
      }
    }
    let _0x9f22e6 = _0x3732ab["concat"](_0x6bbf2);
    let _0x2d13ee = _0x9f22e6["filter"](function (
      _0x4a875b,
      _0x1edb4b,
      _0x3d9991
    ) {
      return (
        _0x3d9991["findIndex"](function (_0x4ff3b3) {
          return _0x4ff3b3["id"] === _0x4a875b["id"];
        }) === _0x1edb4b
      );
    });
    _0x2d13ee = _0x2d13ee["sort"](
      (_0x24269e, _0xd67d15) => _0x24269e["time"] - _0xd67d15["time"]
    );
    return _0x2d13ee;
  } else {
    return [];
  }
};

window["sendMessageFn"] = async function (_0x1ae50f) {
  //发送消息
  let _0xae6ffe = JSON["parse"](_0x1ae50f);
  let _0x1b3d91 = _0xae6ffe["chatId"];
  let _0x132900 = _0xae6ffe["content"];
  let _0xa050c6 = _0xae6ffe["options"];
  let _0x33dcc1 = {
    sendAudioAsVoice: _0xa050c6["sendAudioAsVoice"],
    sendVideoAsGif: _0xa050c6["sendVideoAsGif"],
    sendMediaAsSticker: _0xa050c6["sendMediaAsSticker"],
    sendMediaAsDocument: _0xa050c6["sendMediaAsDocument"],
  };
  if (_0x132900 instanceof Object) {
    _0x33dcc1["attachment"] = _0x132900;
    _0x33dcc1["caption"] = _0xa050c6["caption"];
    _0x132900 = "";
  }
  if (_0x33dcc1["sendMediaAsSticker"] && _0x33dcc1["attachment"]) {
    _0x33dcc1["attachment"] = await formatToWebpSticker(
      _0x33dcc1["attachment"],
      {
        name: _0xa050c6["stickerName"],
        author: _0xa050c6["stickerAuthor"],
        categories: _0xa050c6["stickerCategories"],
      }
    );
  }
  const _0x96505b = window["Store"]["WidFactory"]["createWid"](_0x1b3d91);
  const _0x14d25f = await window["Store"]["Chat"]["find"](_0x96505b);
  const _0x3a1c26 = await sendMessage(_0x14d25f, _0x132900, _0x33dcc1);
  return getMessageModel(_0x3a1c26);
};

async function sendMessage(_0x23b2e5, _0x27856f, _0x220a80) {
  //发送消息
  let _0x1e1da9 = {};
  if (_0x220a80["attachment"]) {
    _0x1e1da9 = _0x220a80["sendMediaAsSticker"]
      ? await processStickerData(_0x220a80["attachment"])
      : await processMediaData(_0x220a80["attachment"], {
          forceVoice: _0x220a80["sendAudioAsVoice"],
          forceDocument: _0x220a80["sendMediaAsDocument"],
          forceGif: _0x220a80["sendVideoAsGif"],
        });
    _0x1e1da9["caption"] = _0x220a80["caption"];
    _0x27856f = _0x220a80["sendMediaAsSticker"]
      ? undefined
      : _0x1e1da9["preview"];
    _0x1e1da9["isViewOnce"] = _0x220a80["isViewOnce"];
    delete _0x220a80["attachment"];
    delete _0x220a80["sendMediaAsSticker"];
  }
  let _0x549a45 = {};
  if (_0x220a80["quotedMessageId"]) {
    let _0x533012 = window["Store"]["Msg"]["get"](_0x220a80["quotedMessageId"]);
    const _0x370d6d = window["Store"]["ReplyUtils"]
      ? window["Store"]["ReplyUtils"]["canReplyMsg"](_0x533012["unsafe"]())
      : _0x533012["canReply"]();
    if (_0x370d6d) {
      _0x549a45 = _0x533012["msgContextInfo"](_0x23b2e5);
    }
    delete _0x220a80["quotedMessageId"];
  }
  if (_0x220a80["mentionedJidList"]) {
    _0x220a80["mentionedJidList"] = await Promise["all"](
      _0x220a80["mentionedJidList"]["map"](async (_0x16498a) => {
        const _0x381232 = window["Store"]["WidFactory"]["createWid"](_0x16498a);
        if (await window["Store"]["QueryExist"](_0x381232)) {
          return _0x381232;
        }
      })
    );
    _0x220a80["mentionedJidList"] =
      _0x220a80["mentionedJidList"]["filter"](Boolean);
  }
  if (_0x220a80["groupMentions"]) {
    _0x220a80["groupMentions"] = _0x220a80["groupMentions"]["map"](
      (_0x238e2d) => ({
        groupSubject: _0x238e2d["subject"],
        groupJid: window["Store"]["WidFactory"]["createWid"](_0x238e2d["id"]),
      })
    );
  }
  let _0x4db442 = {};
  if (_0x220a80["location"]) {
    let {
      latitude: _0x37458c,
      longitude: _0x1b7b6d,
      description: _0x3f7ede,
      url: _0x478fe7,
    } = _0x220a80["location"];
    _0x478fe7 = window["Store"]["Validators"]["findLink"](_0x478fe7)?.["href"];
    _0x478fe7 && !_0x3f7ede && (_0x3f7ede = _0x478fe7);
    _0x4db442 = {
      type: "location",
      loc: _0x3f7ede,
      lat: _0x37458c,
      lng: _0x1b7b6d,
      clientUrl: _0x478fe7,
    };
    delete _0x220a80["location"];
  }
  let _0x329aee = {};
  if (_0x220a80["poll"]) {
    const { pollName: _0x812f23, pollOptions: _0x3f23dd } = _0x220a80["poll"];
    const { allowMultipleAnswers: _0x5b1e1b, messageSecret: _0x6f9a80 } =
      _0x220a80["poll"]["options"];
    _0x329aee = {
      type: "poll_creation",
      pollName: _0x812f23,
      pollOptions: _0x3f23dd,
      pollSelectableOptionsCount: _0x5b1e1b
        ? 0x7d097 ^ 0x7d097
        : 0xe3173 ^ 0xe3172,
      messageSecret:
        Array["isArray"](_0x6f9a80) &&
        _0x6f9a80["length"] === (0xd2526 ^ 0xd2506)
          ? new Uint8Array(_0x6f9a80)
          : window["crypto"]["getRandomValues"](
              new Uint8Array(0x42209 ^ 0x42229)
            ),
    };
    delete _0x220a80["poll"];
  }
  let _0x20cdb0 = {};
  if (_0x220a80["contactCard"]) {
    let _0xc8e815 = window["Store"]["Contact"]["get"](_0x220a80["contactCard"]);
    _0x20cdb0 = {
      body: window["Store"]["VCard"]["vcardFromContactModel"](_0xc8e815)[
        "vcard"
      ],
      type: "vcard",
      vcardFormattedName: _0xc8e815["formattedName"],
    };
    delete _0x220a80["contactCard"];
  } else if (_0x220a80["contactCardList"]) {
    let _0xfd92d2 = _0x220a80["contactCardList"]["map"]((_0xa86a82) =>
      window["Store"]["Contact"]["get"](_0xa86a82)
    );
    let _0x55c562 = _0xfd92d2["map"]((_0x5c1ef5) =>
      window["Store"]["VCard"]["vcardFromContactModel"](_0x5c1ef5)
    );
    _0x20cdb0 = {
      type: "multi_vcard",
      vcardList: _0x55c562,
      body: undefined,
    };
    delete _0x220a80["contactCardList"];
  } else if (
    _0x220a80["parseVCards"] &&
    typeof _0x27856f === "string" &&
    _0x27856f["startsWith"]("DRACV:NIGEB".split("").reverse().join(""))
  ) {
    delete _0x220a80["parseVCards"];
    try {
      const _0x1ad81c = window["Store"]["VCard"]["parseVcard"](_0x27856f);
      if (_0x1ad81c) {
        _0x20cdb0 = {
          type: "vcard",
          vcardFormattedName:
            window["Store"]["VCard"]["vcardGetNameFromParsed"](_0x1ad81c),
        };
      }
    } catch (_0x1c6352) {}
  }
  if (_0x220a80["linkPreview"]) {
    delete _0x220a80["linkPreview"];
    const _0x5d2c0a = window["Store"]["Validators"]["findLink"](_0x27856f);
    if (_0x5d2c0a) {
      let _0x5b8141 = await window["Store"]["LinkPreview"]["getLinkPreview"](
        _0x5d2c0a
      );
      if (_0x5b8141 && _0x5b8141["data"]) {
        _0x5b8141 = _0x5b8141["data"];
        _0x5b8141["preview"] = !![];
        _0x5b8141["subtype"] = "url";
        _0x220a80 = {
          ..._0x220a80,
          ..._0x5b8141,
        };
      }
    }
  }

  let _0x11b387 = {};
  if (_0x220a80["buttons"]) {
    let _0x3e6a63;
    if (_0x220a80["buttons"]["type"] === "tahc".split("").reverse().join("")) {
      _0x27856f = _0x220a80["buttons"]["body"];
      _0x3e6a63 = _0x27856f;
    } else {
      _0x3e6a63 = _0x220a80["caption"] ? _0x220a80["caption"] : " ";
    }
    _0x11b387 = {
      productHeaderImageRejected: ![],
      isFromTemplate: ![],
      isDynamicReplyButtonsMsg: !![],
      title: _0x220a80["buttons"]["title"]
        ? _0x220a80["buttons"]["title"]
        : undefined,
      footer: _0x220a80["buttons"]["footer"]
        ? _0x220a80["buttons"]["footer"]
        : undefined,
      dynamicReplyButtons: _0x220a80["buttons"]["buttons"],
      replyButtons: _0x220a80["buttons"]["buttons"],
      caption: _0x3e6a63,
    };
    delete _0x220a80["buttons"];
  }
  let _0x2307cb = {};
  if (_0x220a80["list"]) {
    if (
      window["Store"]["Conn"]["platform"] === "smba" ||
      window["Store"]["Conn"]["platform"] ===
        "ibms".split("").reverse().join("")
    ) {
      throw "[LT01] Whatsapp business can't send this yet";
    }
    _0x2307cb = {
      type: "list",
      footer: _0x220a80["list"]["footer"],
      list: {
        ..._0x220a80["list"],
        listType: 0x1,
      },
      body: _0x220a80["list"]["description"],
    };
    delete _0x220a80["list"];
    delete _0x2307cb["list"]["footer"];
  }
  const _0x3ca893 = {};
  if (_0x220a80["invokedBotWid"]) {
    _0x3ca893["messageSecret"] = window["crypto"]["getRandomValues"](
      new Uint8Array(0xe9996 ^ 0xe99b6)
    );
    _0x3ca893["botMessageSecret"] = await window["Store"]["BotSecret"][
      "genBotMsgSecretFromMsgSecret"
    ](_0x3ca893["messageSecret"]);
    _0x3ca893["invokedBotWid"] = window["Store"]["WidFactory"]["createWid"](
      _0x220a80["invokedBotWid"]
    );
    _0x3ca893["botPersonaId"] = window["Store"]["BotProfiles"][
      "BotProfileCollection"
    ]["get"](_0x220a80["invokedBotWid"])["personaId"];
    delete _0x220a80["invokedBotWid"];
  }
  const _0x31dba7 = window["Store"]["User"]["getMaybeMeUser"]();
  const _0x49eb53 = await window["Store"]["MsgKey"]["newId"]();
  const _0x58c7fb = new window["Store"]["MsgKey"]({
    from: _0x31dba7,
    to: _0x23b2e5["id"],
    id: _0x49eb53,
    participant: _0x23b2e5["id"]["isGroup"]() ? _0x31dba7 : undefined,
    selfDir: "out",
  });
  const _0x5a9d16 = _0x220a80["extraOptions"] || {};
  delete _0x220a80["extraOptions"];
  const _0x1bd45e =
    window["Store"]["EphemeralFields"]["getEphemeralFields"](_0x23b2e5);
  const _0x2ec3dd = {
    ..._0x220a80,
    id: _0x58c7fb,
    ack: 0x0,
    body: _0x27856f,
    from: _0x31dba7,
    to: _0x23b2e5["id"],
    local: !![],
    self: "out",
    t: parseInt(new Date()["getTime"]() / (0x7da06 ^ 0x7d9ee)),
    isNewMsg: !![],
    type: "chat",
    ..._0x1bd45e,
    ..._0x4db442,
    ..._0x329aee,
    ..._0x1e1da9,
    ...(_0x1e1da9["toJSON"] ? _0x1e1da9["toJSON"]() : {}),
    ..._0x549a45,
    ..._0x20cdb0,
    ..._0x11b387,
    ..._0x2307cb,
    ..._0x3ca893,
    ..._0x5a9d16,
  };
  if (_0x3ca893) {
    delete _0x2ec3dd["canonicalUrl"];
  }
  await window["Store"]["SendMessage"]["addAndSendMsgToChat"](
    _0x23b2e5,
    _0x2ec3dd
  );
  return window["Store"]["Msg"]["get"](_0x58c7fb["_serialized"]);
}

async function formatToWebpSticker(_0x2c6494, _0x31b4f7, _0x53a8d7) {
  //格式化为webp贴纸
  if (_0x2c6494["mimetype"]["includes"]("egami".split("").reverse().join("")))
    _0x53a8d7 = await formatImageToWebpSticker(_0x2c6494);
  else throw new Error("Invalid media format");
  if (_0x31b4f7["name"] || _0x31b4f7["author"]) {
    const _0x5d5bc0 = new webp["Image"]();
    const _0x3e99e6 = generateHash(0x5fad9 ^ 0x5faf9);
    const _0x4f4ce5 = _0x3e99e6;
    const _0x1d3671 = _0x31b4f7["name"];
    const _0x5eadf9 = _0x31b4f7["author"];
    const _0x302c6f = _0x31b4f7["categories"] || [""];
    const _0xd32f05 = {
      "sticker-pack-id": _0x4f4ce5,
      "sticker-pack-name": _0x1d3671,
      "sticker-pack-publisher": _0x5eadf9,
      emojis: _0x302c6f,
    };
    let _0x7b0a5c = Buffer["from"]([
      0x6347f ^ 0x63436,
      0x36208 ^ 0x36241,
      0xe0e1f ^ 0xe0e35,
      0x20676 ^ 0x20676,
      0xe42d1 ^ 0xe42d9,
      0xacc19 ^ 0xacc19,
      0x728d4 ^ 0x728d4,
      0xbbd0c ^ 0xbbd0c,
      0x79233 ^ 0x79232,
      0x9398a ^ 0x9398a,
      0xa9d53 ^ 0xa9d12,
      0x561fb ^ 0x561ac,
      0xf10f3 ^ 0xf10f4,
      0x420a9 ^ 0x420a9,
      0x6bc89 ^ 0x6bc89,
      0x5e175 ^ 0x5e175,
      0xd1ee4 ^ 0xd1ee4,
      0x24e9d ^ 0x24e9d,
      0x72ac8 ^ 0x72ade,
      0x3495e ^ 0x3495e,
      0x2b6db ^ 0x2b6db,
      0x7c5a0 ^ 0x7c5a0,
    ]);
    let _0x199400 = Buffer["from"](JSON["stringify"](_0xd32f05), "utf8");
    let _0x40fdb5 = Buffer["concat"]([_0x7b0a5c, _0x199400]);
    _0x40fdb5["writeUIntLE"](
      _0x199400["length"],
      0xadca3 ^ 0xadcad,
      0x5af06 ^ 0x5af02
    );
    await _0x5d5bc0["load"](Buffer["from"](_0x53a8d7["data"], "base64"));
    _0x5d5bc0["exif"] = _0x40fdb5;
    _0x53a8d7["data"] = (await _0x5d5bc0["save"](null))["toString"]("base64");
  }
  return _0x53a8d7;
}

async function formatImageToWebpSticker(_0x3de068) {
  //格式化图片为webp贴纸
  if (!_0x3de068["mimetype"]["includes"]("image"))
    throw new Error("media is not a image");
  if (_0x3de068["mimetype"]["includes"]("webp")) {
    return _0x3de068;
  }
  return toStickerData(_0x3de068);
}

async function toStickerData(_0x3ef2db) {
  //转换为贴纸数据
  if (_0x3ef2db["mimetype"] === "image/webp") return _0x3ef2db;
  const _0x544c54 = mediaInfoToFile(_0x3ef2db);
  const _0xa119d0 = await window["Store"]["StickerTools"]["toWebpSticker"](
    _0x544c54
  );
  const _0x2033e6 = await _0xa119d0["arrayBuffer"]();
  const _0x165e83 = arrayBufferToBase64(_0x2033e6);
  return {
    mimetype: "image/webp",
    data: _0x165e83,
  };
}

function arrayBufferToBase64(_0x2728b3, _0x3e7efe) {
  //将ArrayBuffer转换为Base64
  _0x3e7efe = "";
  const _0x30f6df = new Uint8Array(_0x2728b3);
  const _0x351322 = _0x30f6df["byteLength"];
  for (let _0x5d53b0 = 0xd883b ^ 0xd883b; _0x5d53b0 < _0x351322; _0x5d53b0++) {
    _0x3e7efe += String["fromCharCode"](_0x30f6df[_0x5d53b0]);
  }
  return window["btoa"](_0x3e7efe);
}

async function processStickerData(_0x2a51fe) {
  //处理贴纸数据
  if (_0x2a51fe["mimetype"] !== "image/webp")
    throw new Error("Invalid media type");
  const _0x3760c8 = mediaInfoToFile(_0x2a51fe);
  let _0x304a4e = await getFileHash(_0x3760c8);
  let _0x4953d3 = await generateHash(0x34b42 ^ 0x34b62);
  const _0x41674c = new AbortController();
  const _0xa79b35 = await window["Store"]["UploadUtils"]["encryptAndUpload"]({
    blob: _0x3760c8,
    type: "sticker",
    signal: _0x41674c["signal"],
    mediaKey: _0x4953d3,
  });
  return {
    ..._0xa79b35,
    clientUrl: _0xa79b35["url"],
    deprecatedMms3Url: _0xa79b35["url"],
    uploadhash: _0xa79b35["encFilehash"],
    size: _0x3760c8["size"],
    type: "sticker",
    filehash: _0x304a4e,
  };
}

async function processMediaData(
  _0x5783da,
  {
    //处理媒体数据
    forceVoice: _0x54ba7a,
    forceDocument: _0x4df2ea,
    forceGif: _0x32e82b,
  }
) {
  const _0x1cfb84 = mediaInfoToFile(_0x5783da);
  const _0x530e74 = await window["Store"]["OpaqueData"]["createFromData"](
    _0x1cfb84,
    _0x1cfb84["type"]
  );
  const _0x3adc61 = window["Store"]["MediaPrep"]["prepRawMedia"](_0x530e74, {
    asDocument: _0x4df2ea,
  });
  const _0x2d26b5 = await _0x3adc61["waitForPrep"]();
  const _0x132369 = window["Store"]["MediaObject"]["getOrCreateMediaObject"](
    _0x2d26b5["filehash"]
  );
  const _0x5d25ea = window["Store"]["MediaTypes"]["msgToMediaType"]({
    type: _0x2d26b5["type"],
    isGif: _0x2d26b5["isGif"],
  });
  if (_0x54ba7a && _0x2d26b5["type"] === "oidua".split("").reverse().join("")) {
    _0x2d26b5["type"] = "ptt";
    const _0x4cf154 = _0x132369["contentInfo"]["waveform"];
    _0x2d26b5["waveform"] = _0x4cf154 ?? (await generateWaveform(_0x1cfb84));
  }
  if (_0x32e82b && _0x2d26b5["type"] === "video") {
    _0x2d26b5["isGif"] = !![];
  }
  if (_0x4df2ea) {
    _0x2d26b5["type"] = "tnemucod".split("").reverse().join("");
  }
  if (!(_0x2d26b5["mediaBlob"] instanceof window["Store"]["OpaqueData"])) {
    _0x2d26b5["mediaBlob"] = await window["Store"]["OpaqueData"][
      "createFromData"
    ](_0x2d26b5["mediaBlob"], _0x2d26b5["mediaBlob"]["type"]);
  }
  _0x2d26b5["renderableUrl"] = _0x2d26b5["mediaBlob"]["url"]();
  _0x132369["consolidate"](_0x2d26b5["toJSON"]());
  _0x2d26b5["mediaBlob"]["autorelease"]();
  const _0x43d763 = await window["Store"]["MediaUpload"]["uploadMedia"]({
    mimetype: _0x2d26b5["mimetype"],
    mediaObject: _0x132369,
    mediaType: _0x5d25ea,
  });
  const _0x26d8d0 = _0x43d763["mediaEntry"];
  if (!_0x26d8d0) {
    throw new Error("upload failed: media entry was not created");
  }
  _0x2d26b5["set"]({
    clientUrl: _0x26d8d0["mmsUrl"],
    deprecatedMms3Url: _0x26d8d0["deprecatedMms3Url"],
    directPath: _0x26d8d0["directPath"],
    mediaKey: _0x26d8d0["mediaKey"],
    mediaKeyTimestamp: _0x26d8d0["mediaKeyTimestamp"],
    filehash: _0x132369["filehash"],
    encFilehash: _0x26d8d0["encFilehash"],
    uploadhash: _0x26d8d0["uploadHash"],
    size: _0x132369["size"],
    streamingSidecar: _0x26d8d0["sidecar"],
    firstFrameSidecar: _0x26d8d0["firstFrameSidecar"],
  });
  return _0x2d26b5;
}

function mediaInfoToFile({
  //将媒体信息转换为文件
  data: _0x46ad3a,
  mimetype: _0x51f247,
  filename: _0xa5191c,
}) {
  const _0x3a81b9 = window["atob"](_0x46ad3a);
  const _0x37f697 = new ArrayBuffer(_0x3a81b9["length"]);
  const _0x5a14c5 = new Uint8Array(_0x37f697);
  for (
    let _0xf3c6b7 = 0x3d73a ^ 0x3d73a;
    _0xf3c6b7 < _0x3a81b9["length"];
    _0xf3c6b7++
  ) {
    _0x5a14c5[_0xf3c6b7] = _0x3a81b9["charCodeAt"](_0xf3c6b7);
  }
  const _0xdb74d3 = new Blob([_0x37f697], {
    type: _0x51f247,
  });
  return new File([_0xdb74d3], _0xa5191c, {
    type: _0x51f247,
    lastModified: Date["now"](),
  });
}

async function getFileHash(_0x132036) {
  //获取文件哈希值
  let _0x4526e1 = await _0x132036["arrayBuffer"]();
  const _0x1bb727 = await crypto["subtle"]["digest"](
    "652-AHS".split("").reverse().join(""),
    _0x4526e1
  );
  return btoa(String["fromCharCode"](...new Uint8Array(_0x1bb727)));
}

async function generateHash(_0x1460c4) {
  //生成哈希值
  var _0xe62ec1 = "";
  var _0x2e203b =
    "9876543210zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA"
      .split("")
      .reverse()
      .join("");
  var _0x500212 = _0x2e203b["length"];
  for (var _0x1ac7e2 = 0xed736 ^ 0xed736; _0x1ac7e2 < _0x1460c4; _0x1ac7e2++) {
    _0xe62ec1 += _0x2e203b["charAt"](
      Math["floor"](Math["random"]() * _0x500212)
    );
  }
  return _0xe62ec1;
}

async function generateWaveform(_0x555c7e) {
  //生成音频波形
  try {
    const _0x58a093 = await _0x555c7e["arrayBuffer"]();
    const _0x3c93db = new AudioContext();
    const _0xefbd14 = await _0x3c93db["decodeAudioData"](_0x58a093);
    const _0x3ad9e1 = _0xefbd14["getChannelData"](0x6463a ^ 0x6463a);
    const _0x3293a1 = 0x6d6e2 ^ 0x6d6a2;
    const _0x336cbe = Math["floor"](_0x3ad9e1["length"] / _0x3293a1);
    const _0x51acfd = [];
    for (
      let _0x203c2d = 0xb1d9f ^ 0xb1d9f;
      _0x203c2d < _0x3293a1;
      _0x203c2d++
    ) {
      const _0x9a2dea = _0x336cbe * _0x203c2d;
      let _0x3f14fb = 0x329c4 ^ 0x329c4;
      for (
        let _0x164db5 = 0xda36c ^ 0xda36c;
        _0x164db5 < _0x336cbe;
        _0x164db5++
      ) {
        _0x3f14fb = _0x3f14fb + Math["abs"](_0x3ad9e1[_0x9a2dea + _0x164db5]);
      }
      _0x51acfd["push"](_0x3f14fb / _0x336cbe);
    }
    const _0x3bb121 = Math["pow"](
      Math["max"](..._0x51acfd),
      -(0xbb8c6 ^ 0xbb8c7)
    );
    const _0x3993a9 = _0x51acfd["map"]((_0x2b629c) => _0x2b629c * _0x3bb121);
    const _0x1bc30f = new Uint8Array(
      _0x3993a9["map"]((_0x315a84) =>
        Math["floor"]((0x627fd ^ 0x62799) * _0x315a84)
      )
    );
    return _0x1bc30f;
  } catch (_0x19d898) {
    return undefined;
  }
}

//获取所有群组
async function getGroups() {
  // 获取所有聊天
  const chats = window.Store.Chat.getModelsArray();

  // 过滤出未归档且包含群组元数据的聊天,并且符合指定的群组类型
  const groups = chats.filter(
    (chat) =>
      chat.__x_groupMetadata && // 是群组
      !chat.__x_archive && // 未归档
      (chat.__x_groupType === "LINKED_ANNOUNCEMENT_GROUP" || // 社区公告群
        chat.__x_groupType === "DEFAULT") // 普通群聊
  );

  // console.log(groups);

  // 提取需要的群组信息
  const groupsInfo = groups.map((group) => {
    return {
      id: group.id._serialized,
      name: group.__x_formattedTitle,
      participants: group.__x_groupMetadata.participants.length,
      creation: group.__x_groupMetadata.creation,
      desc: group.__x_groupMetadata.desc,
      owner: group.__x_groupMetadata.owner?._serialized,
      item: group.__x_groupMetadata.participants._models,
    };
  });

  return groupsInfo;
}

// // 调用示例
// getGroups().then(groups => {
//     console.log('群组列表:', groups);
// }).catch(err => {
//     console.error('获取群组失败:', err);
// });

// ---------------------------------------------------------------------------------------群发 ---------------------------------------------------------------------------------------
function 注入浮动窗口() {
  // 创建宿主元素并添加到body
  const host = document.createElement("div");
  host.id = "custom-floating-window-host";
  host.style.all = "initial"; // 重置所有样式
  document.body.appendChild(host);

  // 创建 Shadow Root 隔离样式
  const shadowRoot = host.attachShadow({ mode: "open" });

  // 创建浮动窗口主容器
  const 浮动窗口 = document.createElement("div");
  浮动窗口.id = "custom-floating-window";

  // 创建样式元素
  const style = document.createElement("style");
  style.textContent = `
      
      #custom-floating-window {
        position: fixed;
        width: 310px;
        height: 100%;
        right: 0;
        top: 0px;
        background-color: #ffffff;
        border: 1px solid #cccccc;
        /* border-radius: 8px; */
        /* box-shadow: 0 4px 12px rgb(0 0 0 / 15%); */
        z-index: 99999999;
        overflow: auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: #333333;
        resize: none;
        padding: 0;
        margin: 0;
        
      }
      

      body {
        padding-right: 320px !important; 
      }

      
      .telegram-app {
        max-width: calc(100% - 320px) !important; 
      }


      .chat-list, .messages-container {
        max-width: calc(100% - 320px) !important;
      }
      
      #custom-floating-window .title-bar {
        padding: 10px 15px;
        cursor: move;
        background-color: #f0f0f0;
        border-bottom: 1px solid #dddddd;
        user-select: none;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      #custom-floating-window .content-area {
        padding: 15px;
      }
      
      #custom-floating-window button {
        padding: 8px 12px;
        background-color: #0088cc;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background-color 0.2s;
        margin-right: 8px;
      }
      
      #custom-floating-window button:hover {
        background-color: #006699;
      }
      
      #custom-floating-window button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
      }
      
      #custom-floating-window .contact-list {
        margin-top: 15px;
        max-height: 275px;
        overflow-y: auto;
        border: 1px solid #dddddd;
        border-radius: 4px;
        padding: 5px;
        display: none;
        background-color: #fafafa;
      }
      
      #custom-floating-window .contact-item {
        display: flex;
        align-items: stretch;
        padding: 8px 10px;
        margin-bottom: 6px;
        border-radius: 4px;
        transition: all 0.2s;
        cursor: pointer;
        background-color: white;
        border: 1px solid #eeeeee;
      }
      
      #custom-floating-window .contact-item:hover {
        background-color: #f5f5f5;
      }
      
      #custom-floating-window .contact-item.selected {
        background-color: #e6f2ff;
        border-left: 3px solid #0088cc;
      }
      
      #custom-floating-window .contact-checkbox {
        width: 12px;
        height: 12px;
        margin-right: 10px;
        cursor: pointer;
        accent-color: #0088cc;
      }
      
      #custom-floating-window .contact-label {
        cursor: pointer;
        user-select: none;
        flex-grow: 1;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      #custom-floating-window .contact-item.selected .contact-label {
        font-weight: bold;
        color: #006699;
      }
      
      #custom-floating-window .action-buttons {
        margin: 15px 0;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
    justify-content: center;
      }
      
      #custom-floating-window .action-buttons button {
        padding: 6px 10px;
        background-color: #f0f0f0;
        color: #333333;
        border: 1px solid #cccccc;
      }
      
      #custom-floating-window .action-buttons button:hover {
        background-color: #e0e0e0;
      }
      
      #custom-floating-window textarea {
        width: 100%;
        height: 100px;
        padding: 10px;
        border: 1px solid #dddddd;
        border-radius: 4px;
        resize: vertical;
        font-family: inherit;
        font-size: 14px;
        margin-top: 10px;
        box-sizing: border-box;
      }
      
      #custom-floating-window textarea:focus {
        outline: none;
        border-color: #0088cc;
        box-shadow: 0 0 0 2px rgba(0, 136, 204, 0.2);
      }
      
      #custom-floating-window #progressContainer {
        margin-top: 10px;
        display: none;
      }
      
      #custom-floating-window .progress-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        font-size: 13px;
        color: #666666;
      }
      
      #custom-floating-window .progress-bar-container {
        height: 20px;
        background-color: #e9ecef;
        border-radius: 4px;
        overflow: hidden;
      }
      
      #custom-floating-window .progress-bar {
        height: 100%;
        width: 0%;
        background-color: #007bff;
        transition: width 0.3s ease;
      }
      
      #custom-floating-window .status-message {
        margin-top: 10px;
        padding: 8px;
        border-radius: 4px;
        font-size: 13px;
      }
      
      #custom-floating-window .status-success {
        background-color: #d4edda;
        color: #155724;
      }
      
      #custom-floating-window .status-error {
        background-color: #f8d7da;
        color: #721c24;
      }
      
      #custom-floating-window .close-btn {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #666666;
        padding: 0;
        margin: 0;
      }
      
      .Select.Send {
        // padding: 12px;
        border-radius: 8px;
        // background-color: #f5f5f5;
        margin: 10px 0;
      }
  
      .Select.Send .option-group {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
  
      .Select.Send .option-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 6px;
        background-color: white;
        border: 1px solid #ddd;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 12px;
      }
  
      .Select.Send .option-item:hover {
        border-color: #0088cc;
      }
  
      .Select.Send .option-item input[type="radio"] {
        margin-right: 8px;
      }
  
      .Select.Send .option-item input[type="radio"]:checked + .option-label {
        color: #0088cc;
        font-weight: bold;
        
      }
  
      .Select.Send .option-item input[type="radio"]:checked {
        accent-color: #0088cc;
      }
  
      .send-controls{
        display: flex;
        justify-content: center;
      }
  
  
  
      .file-upload-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-width: 600px;
        margin: 10px auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
  
      .upload-controls {
        display: flex;
        gap: 12px;
        align-items: center;
        justify-content: space-between;
      }
  
      .upload-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
      }
  
      .upload-btn:hover {
        background-color: #0069d9;
      }
  
      .upload-btn svg {
        width: 14px;
        height: 14px;
      }
  
      #IpImg {
        display: none;
      }
  
      .clear-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background-color: #f8f9fa;
        color: #dc3545;
        border: 1px solid #ddd;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
      }
  
      .clear-btn:hover {
        background-color: #f1f1f1;
      }
  
      .clear-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        color: #6c757d;
      }
  
      .clear-btn svg {
        width: 14px;
        height: 14px;
      }
  
      .preview-area {
        border: 2px dashed #ddd;
        border-radius: 8px;
        padding: 5px;
        text-align: center;
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background-color: #f9f9f9;
        display: none;
      }
  
      .preview-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        color: #999;
      }
  
      .preview-placeholder svg {
        opacity: 0.6;
      }
  
      .preview-placeholder p {
        margin: 0;
        font-size: 14px;
      }
  
      .preview-image {
        max-width: 100%;
        max-height: 200px;
        display: none;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
  
      /* 当有图片时隐藏占位符 */
      .preview-area.has-image .preview-placeholder {
        display: none;
      }
  
      .preview-area.has-image .preview-image {
        display: block;
      }

      #custom-floating-window #dbzt {
        position: fixed;
        bottom: 0px;
        width: 310px;
        right: 0px;
        
        background: white;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        z-index: 999999;
      }

      /* 为了防止内容被固定的元素遮挡，需要给 content-area 添加底部内边距 */
      #custom-floating-window .content-area {
        padding-bottom: 315px;
      }
  
  
    `;

  // 构建窗口HTML结构
  浮动窗口.innerHTML = `
      <div class="title-bar">
        <span style="text-align: center;">WA-消息群发模块1.2 <span id="userName" style="    color: #007bff;"></span></span>
        
      </div>
      <!--<div id='userInfo' style="text-align: center; font-size: 12px; color: #666666; margin-bottom: 10px;">
        <span id="userName"></span>
        <span id="userNumber">号码: </span>
        <img id="userAvatar" src="" alt="用户头像" style="width: 30px; height: 30px; border-radius: 50%; margin-left: 5px;">
      </div>-->
      <div class="content-area">
        <div class="control-panel">
          <button id="loadContactsBtn" style="width: 100%; font-size: 14px;">📋 加载未归档消息列表</button>
          <div id="contactsContainer" class="contact-list"></div>
          
          <div class="action-buttons">
            <button id="selectAllBtn">全选</button>
            <button id="invertSelectBtn">反选</button>
            <button id="clearSelectBtn">清空</button>
          </div>
          
          <div class="message-input">
            <textarea id="messageInput" placeholder="请输入要发送的消息内容..."></textarea></br>
  
            <div class="file-upload-container">
              <div class="upload-controls">
                <label for="IpImg" class="upload-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                  </svg>
                  选择文件
                </label>
                <input type="file" id="IpImg" accept="image/jpeg, image/png, image/bmp, image/webp, image/avif, image/gif, video/mp4, video/webm">
                <button id="clear-btn" type="button" class="clear-btn" disabled  style="padding: 9.5px 16px;" >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                  清空
                </button>
              </div>
              
              <div class="preview-area">
                <div class="preview-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#ccc" viewBox="0 0 16 16">
                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                  </svg>
                  <p>图片预览区域</p>
                </div>
                <img id="preview" src="" alt="预览图" class="preview-image">
              </div>
            </div>
          </div>

          
          
          
          <div id="dbzt">
            <div id="dbzt-s" style="margin: 10px;">
              <div class="Select Send">
                <div class="option-group">
                  <label class="option-item">
                    <input type="radio" name="sendOption" value="default" checked>
                    <span class="option-label">默认模式(有啥发啥，同时有图片和文本会同时发送，具体哪个先发出去取决于网络)</span>
                  </label>
      
                  <label class="option-item">
                    <input type="radio" name="sendOption" value="imageAndText">
                    <span class="option-label">图片+文本</span>
                  </label>
                  
                  <label class="option-item">
                    <input type="radio" name="sendOption" value="textOnly">
                    <span class="option-label">仅文本</span>
                  </label>
                  
                  <label class="option-item">
                    <input type="radio" name="sendOption" value="imageOnly">
                    <span class="option-label">仅图片</span>
                  </label>
                </div>
              </div>

              <div class="send-controls">
                <button id="sendBatchBtn" style="background-color: #28a745;margin: 10px 0;width: 100%;">开始群发</button>
              </div>

              <div id="progressContainer">
                <div class="progress-info">
                  <span id="progressText">准备发送...</span>
                  <span id="progressPercent">0%</span>
                </div>
                <div class="progress-bar-container">
                  <div id="progressBar" class="progress-bar"></div>
                </div>
              </div>
    
              <div id="statusMessage" class="status-message"></div>
            </div>
          </div>
        </div>
      </div>
    `;

  // 将样式和浮动窗口添加到Shadow DOM
  shadowRoot.appendChild(style);
  shadowRoot.appendChild(浮动窗口);

  // 添加这一行来确保主界面不被遮挡
  document.body.style.paddingRight = "320px";
  document.getElementById("app").style.maxWidth = "calc(100% - 310px)";

  async function 模拟发送(msg, id) {
    const messageData = {
      chatId: id,
      content: msg,
      options: {},
    };

    try {
      const result = await window.sendMessageFn(JSON.stringify(messageData));
      // console.log("发送成功:", result);
      return true;
    } catch (error) {
      // console.error("发送失败:", error);
      return false;
    }
  }

  async function 模拟发送图片(图片数据, id) {
    // 获取图片的 MIME type
    function getMimeType(dataURL) {
      return dataURL.split(";")[0].split(":")[1];
    }

    // 获取文件扩展名
    function getExtension(mimeType) {
      const extensions = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
        "image/bmp": "bmp",
      };
      return extensions[mimeType] || "png";
    }

    async function sendImage(chatId, imageDataURL, caption) {
      const mimeType = getMimeType(imageDataURL);
      const extension = getExtension(mimeType);
      const imageAsBase64 = imageDataURL.split(",")[1];

      const messageData = {
        chatId: chatId,
        content: {
          data: imageAsBase64,
          mimetype: mimeType, // 使用原始 MIME type
          filename: `image.${extension}`, // 使用对应的扩展名
        },
        options: {
          caption: caption || "",
          sendMediaAsDocument: false, // 作为文档发送以保持质量
          sendMediaAsSticker: false,
          preserveQuality: true, // 保持原始质量
        },
      };

      try {
        const result = await window.sendMessageFn(JSON.stringify(messageData));
        return true;
      } catch (error) {
        return false;
      }
    }

    return sendImage(id, 图片数据, "");
  }

  async function 模拟发送文本加图片(图片数据, 文本消息, id) {
    // 获取图片的 MIME type
    function getMimeType(dataURL) {
      return dataURL.split(";")[0].split(":")[1];
    }

    // 获取文件扩展名
    function getExtension(mimeType) {
      const extensions = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
        "image/bmp": "bmp",
      };
      return extensions[mimeType] || "png";
    }

    async function sendImage(chatId, imageDataURL, caption) {
      const mimeType = getMimeType(imageDataURL);
      const extension = getExtension(mimeType);
      const imageAsBase64 = imageDataURL.split(",")[1];

      const messageData = {
        chatId: chatId,
        content: {
          data: imageAsBase64,
          mimetype: mimeType, // 使用原始 MIME type
          filename: `image.${extension}`, // 使用对应的扩展名
        },
        options: {
          caption: caption || "",
          sendMediaAsDocument: false, // 作为文档发送以保持质量
          sendMediaAsSticker: false,
          preserveQuality: true, // 保持原始质量
        },
      };

      try {
        const result = await window.sendMessageFn(JSON.stringify(messageData));
        return true;
      } catch (error) {
        return false;
      }
    }

    return sendImage(id, 图片数据, 文本消息);
  }

  async function 模拟发送先文本后图片() {}

  async function 模拟发送先图片后文本() {}

  // 异步获取完整联系人列表（推荐）
  async function 获取联系人列表() {
    return getGroups(); // 返回数组
  }

  // 辅助函数：更新状态消息
  function 更新状态消息(message, type = "info") {
    const statusElement = shadowRoot.getElementById("statusMessage");
    statusElement.textContent = message;
    statusElement.className = "status-message";

    if (type === "success") {
      statusElement.classList.add("status-success");
    } else if (type === "error") {
      statusElement.classList.add("status-error");
    }
  }

  更新状态消息(`已拓展群发功能.`, "success");

  let fileInputImg = null;
  const fileInput = shadowRoot.getElementById("IpImg");
  const preview = shadowRoot.getElementById("preview");
  const clearBtn = shadowRoot.getElementById("clear-btn");
  const previewArea = shadowRoot.querySelector(".preview-area");

  fileInput.addEventListener("change", function (e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];

      // 检查文件类型
      if (!file.type.startsWith("image/")) {
        alert("请选择图片文件");
        return;
      }

      // 创建FileReader读取文件
      const reader = new FileReader();

      reader.onload = function (event) {
        // 使用Data URL预览
        preview.src = event.target.result;

        // 显示预览并更新UI状态
        if (previewArea) {
          previewArea.classList.add("has-image");
          previewArea.style.display = "flex";
        } else {
          preview.style.display = "block";
        }

        if (clearBtn) {
          clearBtn.disabled = false;
        }

        // 存储图片数据
        fileInputImg = event.target.result;
        // console.log('图片数据已加载:', file);
      };

      reader.onerror = function () {
        console.error("文件读取失败");
        if (clearBtn) clearBtn.disabled = true;
      };

      reader.readAsDataURL(file);

      // 同时创建Blob URL备用
      const blobUrl = URL.createObjectURL(file);
      // console.log('Blob URL创建:', blobUrl);
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      // 重置预览
      preview.src = "";
      if (previewArea) {
        previewArea.classList.remove("has-image");
        previewArea.style.display = "none";
      } else {
        preview.style.display = "none";
      }

      // 重置文件输入
      fileInput.value = "";

      // 清除存储的图片数据
      fileInputImg = null;

      // 释放Blob URL内存
      if (preview.src.startsWith("blob:")) {
        URL.revokeObjectURL(preview.src);
      }

      // 禁用清除按钮
      if (clearBtn) {
        clearBtn.disabled = true;
      }
    });

    // 初始状态禁用清除按钮
    clearBtn.disabled = true;
  }

  // 联系人数据存储
  let 联系人数据 = [];
  let 当前选中联系人 = new Set();

  // 在文件顶部添加一个初始化标志
  let hasInitialized = false;
  // 加载联系人按钮功能
  shadowRoot
    .getElementById("loadContactsBtn")
    .addEventListener("click", async function () {
      const 加载按钮 = this;
      const contactsContainer = shadowRoot.getElementById("contactsContainer");

      try {
        加载按钮.disabled = true;
        加载按钮.textContent = "加载中...";
        contactsContainer.style.display = "block";
        contactsContainer.innerHTML =
          '<div style="padding: 20px; text-align: center;">正在加载联系人列表，请稍候...</div>';

        // 检查是否已经初始化过
        if (!hasInitialized) {
          try {
            await initAPI();
            hasInitialized = true; // 标记为已初始化
            // console.log('API 初始化成功');
            更新状态消息(`功能初始化成功。`, "success");

            // 更新DOM元素
            shadowRoot.getElementById("userName").textContent = `    ${
              window.Store.User.getMe().user
            }`;
            // shadowRoot.getElementById('userNumber').textContent = `号码: ${window.Store.User.getMe().user}`;
            // shadowRoot.getElementById('userAvatar').src = avatarUrl;
          } catch (error) {
            console.error("API 初始化失败:", error);
            throw new Error("API 初始化失败，请刷新页面重试");
          }
        }

        // 获取联系人数据
        联系人数据 = await 获取联系人列表();

        // console.log('联系人数据:', 联系人数据);

        if (联系人数据.length === 0) {
          contactsContainer.innerHTML =
            '<div style="padding: 20px; text-align: center; color: #666;">没有找到任何联系人</div>';
          return;
        }

        // 渲染联系人列表
        let contactsHTML = "";
        联系人数据.forEach((contact, index) => {
          const contactId = `contact-${index}-${contact.name.replace(
            /[^a-z0-9]/gi,
            "_"
          )}`;
          contactsHTML += `
            <div class="contact-item" data-contact-id="${contactId}">
              <input type="checkbox" id="${contactId}" class="contact-checkbox" value="${contact.id}">
              <label for="${contactId}" class="contact-label" title="${contact.name}">${contact.name}   人数：${contact.item.length}</label>
            </div>
          `;
        });

        contactsContainer.innerHTML = contactsHTML;

        更新状态消息(
          `已加载 ` + 联系人数据.length + ` 个联系人数据`,
          "success"
        );

        // 添加联系人选择事件
        const contactItems = shadowRoot.querySelectorAll(".contact-item");
        contactItems.forEach((item) => {
          const checkbox = item.querySelector(".contact-checkbox");

          item.addEventListener("click", (e) => {
            // 如果点击的是复选框本身，不处理
            if (e.target === checkbox) return;

            // 判断是否按下了Ctrl或Shift键
            const 是多选模式 = e.ctrlKey || e.shiftKey;

            if (!是多选模式) {
              // 单选模式 - 先取消所有选择
              shadowRoot.querySelectorAll(".contact-checkbox").forEach((cb) => {
                cb.checked = false;
                cb.parentElement.classList.remove("selected");
              });
              当前选中联系人.clear();
            }

            // 切换当前项的选择状态
            checkbox.checked = !checkbox.checked;

            // 更新UI状态
            if (checkbox.checked) {
              item.classList.add("selected");
              当前选中联系人.add(checkbox.value);
              更新状态消息(
                `已选中 ` + 当前选中联系人.size + ` 个联系人`,
                "success"
              );
            } else {
              item.classList.remove("selected");
              当前选中联系人.delete(checkbox.value);
              更新状态消息(
                `已选中 ` + 当前选中联系人.size + ` 个联系人`,
                "success"
              );
            }
          });

          // 处理复选框直接点击
          checkbox.addEventListener("click", (e) => {
            e.stopPropagation();

            if (checkbox.checked) {
              item.classList.add("selected");
              当前选中联系人.add(checkbox.value);
              更新状态消息(
                `已选中 ` + 当前选中联系人.size + ` 个联系人`,
                "success"
              );
            } else {
              item.classList.remove("selected");
              当前选中联系人.delete(checkbox.value);
              更新状态消息(
                `已选中 ` + 当前选中联系人.size + ` 个联系人`,
                "success"
              );
            }
          });
        });
      } catch (error) {
        console.error("加载联系人失败:", error);
        contactsContainer.innerHTML = `
          <div class="status-error" style="padding: 15px;">
            <p>加载联系人失败: ${error.message}</p>
            <button onclick="location.reload()" style="margin-top: 10px;">刷新页面重试</button>
          </div>
        `;
      } finally {
        加载按钮.disabled = false;
        加载按钮.textContent = "📋 加载联系人列表";
      }
    });

  // 输入框被点击
  shadowRoot.getElementById("messageInput").addEventListener("click", () => {});

  // 在浮动窗口HTML结构中,找到textarea元素,添加paste事件监听
  shadowRoot
    .getElementById("messageInput")
    .addEventListener("paste", async (e) => {
      e.preventDefault(); // 阻止默认粘贴行为

      // 获取剪贴板数据
      const items = e.clipboardData.items;

      for (let item of items) {
        // 检查是否是图片
        if (item.type.indexOf("image") !== -1) {
          // 获取图片文件
          const file = item.getAsFile();

          // 创建FileReader读取文件
          const reader = new FileReader();

          reader.onload = function (event) {
            // 使用Data URL预览
            const preview = shadowRoot.getElementById("preview");
            const previewArea = shadowRoot.querySelector(".preview-area");
            const clearBtn = shadowRoot.getElementById("clear-btn");

            preview.src = event.target.result;

            // 显示预览并更新UI状态
            if (previewArea) {
              previewArea.classList.add("has-image");
              previewArea.style.display = "flex";
            } else {
              preview.style.display = "block";
            }

            if (clearBtn) {
              clearBtn.disabled = false;
            }

            // 存储图片数据
            fileInputImg = event.target.result;

            // 提示用户
            更新状态消息("已粘贴图片,可以发送了", "success");
          };

          reader.onerror = function () {
            console.error("图片读取失败");
            更新状态消息("图片读取失败", "error");
          };

          reader.readAsDataURL(file);
          return;
        }
      }
      // 如果没有图片,执行普通文本粘贴
      const text =
        e.clipboardData.getData("application/whatsapp") ||
        e.clipboardData.getData("text/plain");
      const messageInput = shadowRoot.getElementById("messageInput");
      const start = messageInput.selectionStart;
      const end = messageInput.selectionEnd;
      const value = messageInput.value;

      messageInput.value = value.slice(0, start) + text + value.slice(end);
      messageInput.selectionStart = messageInput.selectionEnd =
        start + text.length;
    });

  // 全选按钮
  shadowRoot.getElementById("selectAllBtn").addEventListener("click", () => {
    const checkboxes = shadowRoot.querySelectorAll(".contact-checkbox");
    当前选中联系人.clear();

    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
      checkbox.parentElement.classList.add("selected");
      当前选中联系人.add(checkbox.value);
    });

    更新状态消息(`已全选 ` + 当前选中联系人.size + ` 个联系人`, "success");
  });

  // 反选按钮
  shadowRoot.getElementById("invertSelectBtn").addEventListener("click", () => {
    const checkboxes = shadowRoot.querySelectorAll(".contact-checkbox");
    当前选中联系人.clear();

    checkboxes.forEach((checkbox) => {
      checkbox.checked = !checkbox.checked;

      if (checkbox.checked) {
        checkbox.parentElement.classList.add("selected");
        当前选中联系人.add(checkbox.value);
      } else {
        checkbox.parentElement.classList.remove("selected");
      }
    });

    更新状态消息(
      `已反选，当前选中 ` + 当前选中联系人.size + ` 个联系人`,
      "success"
    );
  });

  // 清空按钮
  shadowRoot.getElementById("clearSelectBtn").addEventListener("click", () => {
    shadowRoot.querySelectorAll(".contact-checkbox").forEach((checkbox) => {
      checkbox.checked = false;
      checkbox.parentElement.classList.remove("selected");
    });

    当前选中联系人.clear();
    更新状态消息("已清空所有选择");
  });

  // 获取当前选中的发送选项
  function getSelectedSendOption() {
    const selectedOption = shadowRoot.querySelector(
      '.Select.Send input[name="sendOption"]:checked'
    );
    return selectedOption ? selectedOption.value : "default";
  }

  // 监听选项变化
  shadowRoot
    .querySelectorAll('.Select.Send input[name="sendOption"]')
    .forEach((radio) => {
      radio.addEventListener("change", function () {
        // console.log('当前选中:', this.value);
        // console.log(getSelectedSendOption());
        // 这里可以添加选项变化时的处理逻辑
      });
    });

  // 群发消息按钮
  shadowRoot
    .getElementById("sendBatchBtn")
    .addEventListener("click", async () => {
      const messageInput = shadowRoot.getElementById("messageInput");
      const message = messageInput.value.trim();

      if (!message && !fileInputImg) {
        更新状态消息("请输入要发送的消息内容", "error");
        return;
      }

      if (当前选中联系人.size === 0) {
        更新状态消息("请至少选择一个联系人", "error");
        return;
      }

      const progressContainer = shadowRoot.getElementById("progressContainer");
      const progressText = shadowRoot.getElementById("progressText");
      const progressPercent = shadowRoot.getElementById("progressPercent");
      const progressBar = shadowRoot.getElementById("progressBar");

      progressContainer.style.display = "block";
      progressText.textContent = `准备发送 (0/${当前选中联系人.size})`;
      progressPercent.textContent = "0%";
      progressBar.style.width = "0%";

      const 发送按钮 = shadowRoot.getElementById("sendBatchBtn");
      const 原按钮文本 = 发送按钮.textContent;
      发送按钮.disabled = true;
      发送按钮.textContent = "发送中...";

      let successCount = 0;
      let failCount = 0;
      const 所有联系人 = Array.from(当前选中联系人);
      const 总数量 = 所有联系人.length;

      for (let i = 0; i < 总数量; i++) {
        const contactName = 所有联系人[i];
        try {
          // 更新进度显示
          const progress = Math.floor(((i + 1) / 总数量) * 100);
          progressText.textContent = `发送中 (${
            i + 1
          }/${总数量}) 成功: ${successCount}, 失败: ${failCount}`;
          progressPercent.textContent = `${progress}%`;
          progressBar.style.width = `${progress}%`;

          let sendResult;
          const sendOptionItem = getSelectedSendOption();

          switch (sendOptionItem) {
            case "default":
              // 默认发送逻辑：智能判断内容
              if (fileInputImg && message) {
                // 同时有图片和消息，先发送图片再发送消息
                sendResult = await 模拟发送图片(fileInputImg, contactName);
                sendResult = await 模拟发送(message, contactName);
              } else if (fileInputImg) {
                // 只有图片
                sendResult = await 模拟发送图片(fileInputImg, contactName);
              } else if (message) {
                // 只有消息
                sendResult = await 模拟发送(message, contactName);
              } else {
                console.log("错误：没有可发送的内容");
                return false; // 或者抛出错误
              }
              break;

            case "imageAndText":
              // 必须同时有图片和文本
              if (!fileInputImg || !message) {
                console.log("错误：图片+文本模式需要同时有图片和文本内容");
                return false;
              }
              sendResult = await 模拟发送文本加图片(
                fileInputImg,
                message,
                contactName
              );
              break;

            case "textOnly":
              // 仅文本模式
              if (!message) {
                console.log("错误：文本模式需要消息内容");
                return false;
              }
              sendResult = await 模拟发送(message, contactName);
              break;

            case "imageOnly":
              // 仅图片模式
              if (!fileInputImg) {
                console.log("错误：图片模式需要图片内容");
                return false;
              }
              sendResult = await 模拟发送图片(fileInputImg, contactName);
              break;

            default:
              console.log("错误：未知的发送选项");
              return false;
          }

          if (sendResult) {
            successCount++;
          } else {
            failCount++;
          }

          // 随机延迟 (600-1000ms)
          await new Promise((resolve) =>
            setTimeout(resolve, Math.floor(Math.random() * 701) + 999)
          );
        } catch (error) {
          console.error(`发送给 ${contactName} 失败:`, error);
          failCount++;
        }
      }

      // 完成后的处理
      progressText.textContent = `发送完成 (${总数量}/${总数量}) 成功: ${successCount}, 失败: ${failCount}`;
      progressPercent.textContent = "100%";
      progressBar.style.width = "100%";

      if (failCount === 0) {
        更新状态消息(`消息已成功发送给 ${successCount} 个联系人`, "success");
      } else {
        更新状态消息(
          `发送完成: 成功 ${successCount} 个, 失败 ${failCount} 个`,
          failCount === 总数量 ? "error" : "warning"
        );
      }

      messageInput.value = "";
      shadowRoot.getElementById("clear-btn").click(); // 清空预览和图片数据

      发送按钮.disabled = false;
      发送按钮.textContent = 原按钮文本;
    });
}

// 调用函数注入浮动窗口
注入浮动窗口();

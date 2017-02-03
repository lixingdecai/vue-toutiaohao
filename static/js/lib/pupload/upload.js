const accessid = '6MKOqxGiGU4AUk44';
  const accesskey = 'ufu7nS8kS59awNihtjSonMETLI0KLy';
  const host = 'http://post-test.oss-cn-hangzhou.aliyuncs.com';

  let gDirname = '';
  let gObjectName = '';
  let gObjectNameType = '';
  // const now = timestamp = Date.parse(new Date()) / 1000;
  const policyText = {
    // 设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
    expiration: '2020-01-01T12:00:00.000Z',
    // 设置上传文件的大小限制
    conditions: [
    ['content-length-range', 0, 1048576000]
    ]
  };

  const policyBase64 = Base64.encode(JSON.stringify(policyText));
  const message = policyBase64;
  const bytes = Crypto.hmac(Crypto.SHA1, message, accesskey, { asBytes: true });
  const signature = Crypto.util.bytesToBase64(bytes);

  function checkObjectRadio() {
    const tt = document.getElementsByName('myradio');
    for (let i = 0; i < tt.length; i++) {
      if (tt[i].checked) {
        gObjectNameType = tt[i].value;
        break;
      }
    }
  }

  function getDirname() {
    let dir = document.getElementById('dirname').value;
    if (dir !== '' && dir.indexOf('/') !== dir.length - 1) {
      dir += '/';
    }
    // alert(dir)
    gDirname = dir;
  }

  function randomString(len) {
    const len1 = len || 32;
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < len1; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }

  function getSuffix(filename) {
    const pos = filename.lastIndexOf('.');
    let suffix = '';
    if (pos !== -1) {
      suffix = filename.substring(pos);
    }
    return suffix;
  }

  function calculateObjectName(filename) {
    if (gObjectNameType === 'local_name') {
      gObjectName += `${filename}`;
    } else if (gObjectNameType === 'random_name') {
      const suffix = getSuffix(filename);
      gObjectName = gDirname + randomString(10) + suffix;
    }
    return '';
  }

  function getUploadedObjectName(filename) {
    if (gObjectNameType === 'local_name') {
      let tmpName = gObjectName;
      tmpName = tmpName.replace(`${filename}`, filename);
      return tmpName;
    } else if (gObjectNameType === 'random_name') {
      return gObjectName;
    }
    return gObjectName;
  }

  function setUploadParam(up, filename) {
    gObjectName = gDirname;
    if (filename !== '') {
      calculateObjectName(filename);
    }
    const newMultipartParams = {
      key: gObjectName,
      policy: policyBase64,
      OSSAccessKeyId: accessid,
      // 让服务端返回200,不然，默认会返回204
      success_action_status: '200',
      signature: signature,
    };
    up.setOption({
      url: host,
      multipart_params: newMultipartParams
    });
    up.start();
  }

  const uploader = new plupload.Uploader({
    runtimes: 'html5,flash,silverlight,html4',
    browse_button: 'selectfiles',
    // multi_selection: false,
    container: document.getElementById('container'),
    flash_swf_url: '../../static/js/lib/pupload/plupload-2.1.2/js/Moxie.swf',
    silverlight_xap_url: '../../static/js/lib/pupload/plupload-2.1.2/js/Moxie.xap',
    url: 'http://oss.aliyuncs.com',
    init: {
      PostInit: () => {
        document.getElementById('ossfile').innerHTML = '';
        document.getElementById('postfiles').onclick = () => {
          setUploadParam(uploader, '', false);
          return false;
        };
      },
      FilesAdded: (up, files) => {
        plupload.each(files, file => {
          document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
          + '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
          + '</div>';
        });
      },

      BeforeUpload: (up, file) => {
        checkObjectRadio();
        getDirname();
        setUploadParam(up, file.name, true);
      },

      UploadProgress: (up, file) => {
        const d = document.getElementById(file.id);
        d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + '%</span>';
        const prog = d.getElementsByTagName('div')[0];
        const progBar = prog.getElementsByTagName('div')[0];
        progBar.style.width = (2 * file.percent) + 'px';
        progBar.setAttribute('aria-valuenow', file.percent);
      },

      FileUploaded: (up, file, info) => {
        if (info.status === 200) {
          document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, object name:' + getUploadedObjectName(file.name);
        } else {
          document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
        }
      },
      Error: (up, err) => {
        document.getElementById('console').appendChild(document.createTextNode('\nError xml:' + err.response));
      }
    }
  });

  uploader.init();
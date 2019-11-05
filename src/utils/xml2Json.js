export default function xmlStrToJsonObj(xmlStr) {
  const xmlObj = xmlStrToXmlObj(xmlStr);

  let jsonObj = {};
  if (xmlObj.childNodes.length > 0) {
    jsonObj = xmlToJson(xmlObj);
  }
  return jsonObj;
}

function xmlStrToXmlObj(xmlStr) {
  let xmlObj = {};
  if (document.all) {
    const xmlDom = new ActiveXObject('Microsoft.XMLDOM');
    xmlDom.loadXML(xmlStr);
    xmlObj = xmlDom;
  } else {
    xmlObj = new DOMParser().parseFromString(xmlStr, 'text/xml');
  }
  return xmlObj;
}

function xmlToJson(xml) {
  // Create the return object
  let obj = {};
  if (xml.nodeType === 1) {
    // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj['@attributes'] = {};
      for (let j = 0; j < xml.attributes.length; j += 1) {
        const attribute = xml.attributes.item(j);
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) {
    // text
    obj = xml.nodeValue;
  }
  // do children
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i += 1) {
      const item = xml.childNodes.item(i);
      const { nodeName } = item;
      if (typeof obj[nodeName] === 'undefined') {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof obj[nodeName].length === 'undefined') {
          const old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        if (typeof obj[nodeName] !== 'object') obj[nodeName] = [];
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

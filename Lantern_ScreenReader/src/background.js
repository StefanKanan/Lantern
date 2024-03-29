// Generated by CoffeeScript 2.3.2
(function() {
  /*
  Helpers
  */
  var Button, Comments, Form, Media, Section, aText, addElement, click, findKey, getParent, jsonld, jsonldRdfaParser, notification, onAction, place, play, readMenu, speak, tree,
    indexOf = [].indexOf;

  jsonld = require('../node_modules/jsonld');

  jsonldRdfaParser = require('../node_modules/jsonld-rdfa-parser');

  Section = class Section {
    constructor(element, content = 'contains') {
      var key;
      this.id = element['@id'];
      key = findKey(element, 'name');
      this.name = element[key][0]['@value'];
      this.type = 'section';
      this.addChildrenIds(element, content);
    }

    addChildrenIds(element, content) {
      var id, ids, j, len1, results;
      this.children = [];
      content = findKey(element, content);
      ids = element[content];
      if (ids == null) {
        return;
      }
      if (typeof ids === 'object') { //if multiple children
        results = [];
        for (j = 0, len1 = ids.length; j < len1; j++) {
          id = ids[j];
          results.push(this.children.push(id['@id']));
        }
        return results;
      } else {
        return this.children.push(ids['@id']);
      }
    }

    addChildren(elements) {
      var i, id, j, len, ref, results;
      len = this.children.length;
      results = [];
      for (i = j = 0, ref = len; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        id = this.children[i];
        elements[id][0].parent = this.id;
        this.children[i] = elements[id][0];
        results.push(elements[id][1] += 1);
      }
      return results;
    }

    onAction() {
      return this.children;
    }

  };

  aText = class aText extends Section {
    constructor(element) {
      var key, ref;
      super(element, 'alternatives');
      key = findKey(element, 'content');
      this.content = (ref = element[key]) != null ? ref[0]['@value'] : void 0;
      this.type = 'text';
    }

    onAction() {
      if (this.children.length > 0) {
        return this.children;
      } else if (this.content != null) {
        chrome.tts.speak(this.content);
        return console.log(this.content);
      }
    }

  };

  Media = class Media extends Section {
    constructor(element) {
      var key, ref, ref1;
      super(element);
      key = findKey(element, 'source');
      this.source = (ref = element[key]) != null ? ref[0]['@id'] : void 0;
      key = findKey(element, 'type', true);
      this.mediaType = (ref1 = element[key]) != null ? ref1[0]['@value'] : void 0;
      this.type = 'media';
    }

    onAction() {
      if (this.source != null) {
        return console.log(this.source); //todo play source
      }
    }

  };

  Form = class Form extends Section {
    constructor(element) {
      var key, ref;
      super(element);
      key = findKey(element, 'source');
      this.source = (ref = element[key]) != null ? ref[0]['@value'] : void 0;
      this.type = 'form';
    }

    onAction() {
      if (this.source != null) {
        return console.log(this.source); //todo place cursor on button
      }
    }

  };

  Button = class Button extends Section {
    constructor(element) {
      var key, ref;
      super(element);
      key = findKey(element, 'source');
      this.source = (ref = element[key]) != null ? ref[0] : void 0;
      if (indexOf.call(Object.keys(this.source), '@id') >= 0) {
        this.source = this.source['@id'];
        this.buttonType = 'link';
      } else {
        this.source = this.source['@value'];
        this.buttonType = 'button';
      }
      this.type = 'button';
    }

    onAction() {
      if (this.source != null) {
        return console.log(this.source); //todo go to link
      }
    }

  };

  Comments = class Comments {
    constructor(element) {}

  };

  notification = class notification {
    constructor(element) {}

  };

  tree = class tree {
    constructor(elements) {
      var element, key;
      this.children = [];
      for (key in elements) {
        element = elements[key];
        if (element[1] === 0) {
          this.children.push(element[0]);
        }
      }
    }

  };

  //each class has id
  addElement = function(element) {
    var Type, filter, obj;
    Type = element["@type"][0];
    filter = /[A-Za-z]*$/;
    Type = filter.exec(Type)[0];
    obj = null;
    switch (Type) {
      case 'section':
        return new Section(element);
      case 'text':
        return new aText(element);
      case 'media':
        return new Media(element);
      case 'form':
        return new Form(element);
      case 'button':
        return new Button(element);
      case 'comment':
        return new Comments(element);
      case 'notification':
        return new notification(element);
      default:
        return null;
    }
  };

  findKey = function(dict, key, exclude = false) {
    var filter, k, match;
    for (k in dict) {
      filter = /[A-Za-z]*$/;
      match = filter.exec(k)[0];
      if (exclude) {
        if (indexOf.call(k, '@') >= 0) {
          continue;
        }
      }
      if (match === key) {
        return k;
      }
    }
  };

  readMenu = function(menu, index) {
    var element, i, j, len, more, ref, ref1;
    len = menu.length;
    more = 0;
    if (len - index > 4) {
      more = 1;
      len = index + 4;
    }
    for (i = j = ref = index, ref1 = len; (ref <= ref1 ? j < ref1 : j > ref1); i = ref <= ref1 ? ++j : --j) {
      element = menu[i];
      chrome.tts.speak(element.name, {
        'enqueue': true
      });
    }
    if (more === 1) {
      return chrome.tts.speak('more', {
        'enqueue': true
      });
    }
  };

  getParent = function(elements) {
    var key, list, menu, node, nodes, parent, ref;
    menu = elements['elements'][0].parent;
    nodes = elements['nodes'];
    if (findKey(nodes, menu) != null) {
      return null;
    }
    parent = (ref = nodes[menu]) != null ? ref[0].parent : void 0;
    if (menu == null) {
      return elements['elements'];
    } else if (parent == null) {
      list = [];
      for (key in nodes) {
        node = nodes[key];
        if (node[1] === 0) {
          list.push(node[0]);
        }
      }
      return list;
    } else {
      return nodes[parent][0].children;
    }
  };

  onAction = function(element) {
    var type;
    type = element.type;
    if (element.children.length > 0) {
      return element.children;
    } else {
      switch (type) {
        case 'text':
          return speak(element.content);
        case 'media':
          return play(element.source, element.mediaType);
        case 'form':
          return place(element.source);
        case 'button':
          return click(element.source);
      }
    }
  };

  speak = function(content) {
    if (content != null) {
      return chrome.tts.speak(content);
    }
  };

  play = function(source, type) {
    console.log(source, type);
    return chrome.tabs.executeScript({
      code: `var script = document.createElement('script'); script.id = 'mediaFunctions'; script.text = 'function play() { media.play(); } function pause() { media.pause(); } media = new ${type}(\\'${source}\\');'; var play = document.createElement('script'); play.id = 'playMedia'; play.text = 'media.play()'; document.body.appendChild(script); document.body.appendChild(play);`
    });
  };

  place = function(source) {
    return chrome.tabs.executeScript({
      code: `document.getElementById('${source}').focus();`
    }, function() {
      return chrome.tts.speak('Write');
    });
  };

  click = function(source) {
    return chrome.tabs.executeScript({
      code: `try{ new URL('${source}'); window.location = '${source}' } catch (_){ document.getElementById('${source}').click(); }`
    });
  };

  /*
  Listens for events in the browser, if it's triggered it runs and then unloads itself
  */
  chrome.runtime.onInstalled.addListener(function() {
    //storage lets multiple extension components access this parameter
    return chrome.storage.sync.set({
      s: '#3aa757'
    }, function() {
      return console.log("green");
    });
  });

  //loaded when needed and then removed
  chrome.declarativeContent.onPageChanged.removeRules(void 0, function() {
    return chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: 'developer.chrome.com'
            }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction]
      }
    ]);
  });

  //listen for RDFa elements
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var _, a, content, element, elements, j, key, len1, mark, node, root;
    content = request.test;
    console.log(request.test); //todo
    elements = {};
    mark = 0;
    for (j = 0, len1 = content.length; j < len1; j++) {
      element = content[j];
      try {
        //Skip declarations
        node = addElement(element);
      } catch (error) {
        _ = error;
        continue;
      }
      if (node == null) {
        continue;
      }
      a = [node, 0];
      elements[node.id] = a;
    }
//elements = {id: [node, 0]...}
    for (key in elements) {
      element = elements[key][0];
      element.addChildren(elements);
    }
    root = new tree(elements);
    elements = {
      elements: root.children,
      index: 0,
      notifications: [],
      nodes: elements
    };
    console.log('background.coffee');
    console.log(elements);
    readMenu(elements['elements'], 0);
    return chrome.storage.local.set({
      tree: elements
    });
  });

  //TODO use onPageChange
  //If no tree, or new page, or page change
  //parse tree (content script)
  //read elements name (function)

  //On refresh rate
  //parse page for notifications
  //add list to notifications, change index to 0
  //if change read elements name using index

  //Notifications OPTIONAL
  //Keep list of elements, {elements: [], index = 0, notifications: []}
  //when issuing command, if index >= len(notifications) element[index] else notifications[index]

  //todo OPTIONAL, listen for changes

  //Commands must be issued with Ctrl
  chrome.commands.onCommand.addListener(function(command) {
    console.log(command);
    chrome.tts.stop();
    //Before we use the new command, stop any previous commands
    return chrome.tabs.executeScript({
      file: 'pause.js'
    }, function() {
      return chrome.storage.local.get(['tree'], function(result) {
        var elements, index, keyPress, len, list, menu, prev;
        elements = result.tree;
        if (elements == null) { //The tree is still not generated
          console.log('no elements');
          return;
        }
        keyPress = -1;
        prev = false;
        switch (command) {
          case 'first':
            keyPress = 0;
            break;
          case 'second':
            keyPress = 1;
            break;
          case 'third':
            keyPress = 2;
            break;
          case 'fourth':
            keyPress = 3;
            break;
          case 'more':
            keyPress = 4;
            break;
          case 'previous':
            prev = true;
            break;
          case 'repeat':
            readMenu(elements['elements'], elements['index']);
        }
        index = elements['index'];
        if (keyPress !== -1) {
          menu = elements['elements'];
          notification = elements['notification'];
          len = menu.length;
          if (keyPress === 4) {
            index += 4;
            elements['index'] = index;
            readMenu(elements['elements'], index);
            chrome.storage.local.set({
              tree: elements
            });
          } else if (index + keyPress < len) {
            index = index + keyPress;
            list = onAction(menu[index]);
            if (list != null) {
              elements = {
                elements: list,
                index: 0,
                notifications: [],
                nodes: elements['nodes']
              };
              chrome.storage.local.set({
                tree: elements
              });
              readMenu(elements['elements'], 0);
            }
          }
        } else if (prev) {
          if (index !== 0) {
            index -= 4;
            elements = {
              elements: elements['elements'],
              index: index,
              notifications: [],
              nodes: elements['nodes']
            };
            chrome.storage.local.set({
              tree: elements
            });
          } else {
            list = getParent(elements);
            elements = {
              elements: list,
              index: index,
              notifications: [],
              nodes: elements['nodes']
            };
            chrome.storage.local.set({
              tree: elements
            });
          }
          readMenu(elements['elements'], index);
        }
        return console.log(elements);
      });
    });
  });

}).call(this);

//# sourceMappingURL=background.js.map

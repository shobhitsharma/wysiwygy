const Defaults = {

  options: {
    style: true,
    toolbar: [],
    colors: [],
    templates: [],
    icons: {
      class: 'material-icons',
      definitions: {}
    }
  },

  toolbar: {
    format: {
      icon: 'title',
      label: 'Headline Format',
      command: 'formatBlock',
      dropdown: [{
          id: 'h1',
          label: 'Header 1'
        },
        {
          id: 'h2',
          label: 'Header 2'
        },
        {
          id: 'h3',
          label: 'Header 3'
        },
        {
          id: 'h4',
          label: 'Header 4'
        },
        {
          id: 'p',
          label: 'Paragraph'
        },
        {
          id: 'pre',
          label: 'Preformatted'
        },
        {
          id: 'blockquote',
          label: 'Quote'
        }
      ]
    },

    fontSize: {
      icon: 'format_size',
      label: 'Font Size',
      command: 'fontSize',
      dropdown: [{
          id: 1,
          label: 'Minimum'
        },
        {
          id: 2,
          label: 'Smaller'
        },
        {
          id: 3,
          label: 'Normal'
        },
        {
          id: 4,
          label: 'Medium'
        },
        {
          id: 5,
          label: 'Large'
        },
        {
          id: 6,
          label: 'Extra Large'
        },
        {
          id: 7,
          label: 'Maximum'
        }
      ]
    },

    fontColor: {
      icon: 'format_color_text',
      label: 'Font Color',
      command: 'foreColor',
      field: 'colors',
      modal: true
    },

    fontBackground: {
      icon: 'format_color_fill',
      label: 'Font Background',
      command: 'backColor',
      field: 'colors',
      modal: true
    },

    source: {
      icon: 'code',
      label: 'Show HTML',
      command: 'insertHTML',
      modal: true
    },

    undo: {
      icon: 'undo',
      label: 'Undo',
      command: 'undo'
    },

    redo: {
      icon: 'redo',
      label: 'Redo',
      command: 'redo'
    },

    reformat: {
      icon: 'format_clear',
      label: 'Remove Formatting',
      command: 'removeFormat'
    },

    bold: {
      icon: 'format_bold',
      label: 'Bold',
      command: 'bold'
    },

    italic: {
      icon: 'format_italic',
      label: 'Italic',
      command: 'italic'
    },

    underline: {
      icon: 'format_underlined',
      label: 'Underline',
      command: 'underline'
    },

    strike: {
      icon: 'format_strikethrough',
      label: 'Strike',
      command: 'strikeThrough'
    },

    leftAlign: {
      icon: 'format_align_left',
      label: 'Left Align',
      command: 'justifyLeft'
    },

    rightAlign: {
      icon: 'format_align_right',
      label: 'Right Align',
      command: 'justifyRight'
    },

    centerAlign: {
      icon: 'format_align_center',
      label: 'Center Align',
      command: 'justifyCenter'
    },

    fullAlign: {
      icon: 'format_align_justify',
      label: 'Justify',
      command: 'justifyFull'
    },

    numberedList: {
      icon: 'format_list_bulleted',
      label: 'Ordered List',
      command: 'insertOrderedList'
    },

    orderedList: {
      icon: 'format_list_bulleted',
      label: 'Unordered List',
      command: 'insertUnorderedList'
    },

    link: {
      icon: 'insert_link',
      label: 'Link',
      command: 'createLink',
      modal: true
    },

    unlink: {
      icon: 'wb_iridescent',
      label: 'Unlink',
      command: 'unlink'
    },

    image: {
      icon: 'camera_alt',
      label: 'Image',
      command: 'insertImage',
      modal: true
    },

    table: {
      icon: 'grid_on',
      label: 'Table',
      command: 'insertTable'
    },

    templates: {
      icon: 'description',
      label: 'Templates',
      command: 'template',
      field: 'templates',
      modal: true
    }
  }
};

module.exports = Defaults;
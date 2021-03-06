/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

//读取app

Ext.define('MyDesktop.App', {
    extend: 'Ext.ux.desktop.App',

    requires: [
        'Ext.window.MessageBox',
        'Ext.ux.desktop.ShortcutModel',

       /* 'MyDesktop.SystemStatus',
        'MyDesktop.VideoWindow',
        'MyDesktop.GridWindow',
        'MyDesktop.TabWindow',
        'MyDesktop.AccordionWindow',
        'MyDesktop.Notepad',
        'MyDesktop.BogusMenuModule',
        'MyDesktop.BogusModule',*/
        'MyDesktop.Settings',
        // zp add
        'MyDesktop.WindowFrame'
    ],

    menuData:null,

    init: function() {
        // custom logic before getXYZ methods get called...

        var menuData;

        Ext.Ajax.request({
            async:false,
            url:'data/app.json',
            success:function(response){
                menuData = Ext.JSON.decode(response.responseText);
            }
        });

        this.menuData = menuData;

        this.callParent();
        // now ready...
    },

    getModules : function(){

        // this.dataNewModules = [
        //     new MyDesktop.Test('zhangguangliang'),
        //     new MyDesktop.Test('zhangpeng')];

        // this.dataShortCuts = [
        //     { name: '在线查控', iconCls: 'grid-shortcut', module: 'zhangguangliang' },
        //     { name: '在线查鹏', iconCls: 'grid-shortcut', module: 'zhangpeng' }];
        
        // //return this.dataNewModules;

        // return [
        //     new MyDesktop.VideoWindow(),
        //     //new MyDesktop.Blockalanche(),
        //     new MyDesktop.SystemStatus(),
        //     new MyDesktop.GridWindow(),
        //     new MyDesktop.TabWindow(),
        //     new MyDesktop.AccordionWindow(),
        //     new MyDesktop.Notepad(),
        //     new MyDesktop.BogusMenuModule(),
        //     new MyDesktop.BogusModule(),
        //     new MyDesktop.Test(),
        //     new MyDesktop.Test('zhangguangliang'),
        //     new MyDesktop.Test('zhangpeng')
        // ];

        var modules = [];
        var menuData = this.menuData;

        for(var i = 0; i<menuData.length;i++){
            modules.push(
                new MyDesktop.WindowFrame({
                    text:menuData[i].text,
                    smallIcon:menuData[i].smallIcon,
                    id:menuData[i].id+'module',
                    url:menuData[i].url
                }));
        }

        return modules;

    },

    getDesktopConfig: function () {
        var me = this, ret = me.callParent();


        var data=[];

        var menuData = this.menuData;

        for (var i = 0; i <menuData.length; i++) {
            data.push({
                name:menuData[i].text,
                iconCls:menuData[i].icon,
                module:menuData[i].id+'module'
            })
        };

        return Ext.apply(ret, {

            contextMenuItems: [
                { text: '设置桌面背景', handler: me.onSettings, scope: me }
            ],

            shortcuts: Ext.create('Ext.data.Store', {
                model: 'Ext.ux.desktop.ShortcutModel',
                //data: this.dataShortCuts
                data: data

            }),

            wallpaper: 'wallpapers/Blue-Sencha.jpg',
            wallpaperStretch: false
        });
    },




    // config for the start menu
    getStartConfig : function() {
        var me = this, ret = me.callParent();


        var startMenuTitle;

        Ext.Ajax.request({
            async:false,
            url:'data/user.json',
            success:function(response){
                var results = Ext.JSON.decode(response.responseText);
                startMenuTitle = results.userName;
            }
        });

        return Ext.apply(ret, {
            title: startMenuTitle,
            iconCls: 'user',
            height: 300,
            toolConfig: {
                width: 100,
                items: [
                    {
                        text:'设置',
                        iconCls:'settings',
                        handler: me.onSettings,
                        scope: me
                    },
                    '-',
                    {
                        text:'退出',
                        iconCls:'logout',
                        handler: me.onLogout,
                        scope: me
                    }
                ]
            }
        });
    },

    getTaskbarConfig: function () {
        var ret = this.callParent();

        return Ext.apply(ret, {
            quickStart: [
                /*{ name: 'Accordion Window', iconCls: 'accordion', module: 'acc-win' },
                { name: 'Grid Window', iconCls: 'icon-grid', module: 'grid-win' }*/
            ],
            trayItems: [
                { xtype: 'trayclock', flex: 1 }
            ]
        });
    },

    onLogout: function () {
        Ext.Msg.confirm('退出', '你确定要退出吗？');
    },

    onSettings: function () {
        var dlg = new MyDesktop.Settings({
            desktop: this.desktop
        });
        dlg.show();
    }
});

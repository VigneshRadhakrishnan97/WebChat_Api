const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth")
const { check, validationResult } = require("express-validator");
const User=require('../../model/User');
const Chat=require('../../model/Chat');


//@route  POST api/createchat
//@desc   create chat
//@access Private
router.post("/",[ auth,[check('chatname','Enter chatname...').exists()]],async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const { chatname, emails } = req.body;

      //if chat name exist
      let newchat = await Chat.findOne({ chatname });
      if (newchat)
        return res
          .status(400)
          .json({ error: [{ msg: "Chat name already exist" }] });

      //if chat name not exist
       newchat = new Chat({
        creator: user.email,
        chatname: chatname,
        users: [...emails],
        chat: [
          // {
          //   email: user.email,
          //   name: user.name,
          //   avatar: user.avatar,
          //   text: "Hi there! New chat has bee created...",
          // },
        ],
      });

      await newchat.save();
       return res.json(newchat.id);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
    

});


//@route  Get api/createchat
//@desc   get all chats for user
//@access Private
router.get(
  "/",
  auth,
  async (req, res) => {
    

    try {
      const user = await User.findById(req.user.id).select("-password");
      const chats = await Chat.find();
      let chatcreators_id=[];
      let Allchats = [];

        chats.forEach((chat) => {
            if (chat.creator === user.email)
            {
               chatcreators_id=[...chatcreators_id, {id:chat._id,creator:chat.creator,chatname:chat.chatname,Notify:0}];
               Allchats=[...Allchats,chat];
            }
            else if (chat.users.find((c) => c === user.email)) 
            {
              chatcreators_id = [
                ...chatcreators_id,
                {
                  id: chat._id,
                  creator: chat.creator,
                  chatname: chat.chatname,
                  Notify: 0,
                },
              ];
            Allchats = [...Allchats, chat];

          }
        });

        return res.json({chatid:[...chatcreators_id],Allchats});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

//@route  Get api/createchat
//@desc   get  chat by id
//@access Private
router.get(
  "/:id",
  auth,
  async (req, res) => {
    

    try {
    
      const chat = await Chat.findById(req.params.id);
      
       if (!chat)
         return res
           .status(400)
           .json({ error: [{ msg: "No chat exists with this id" }] }); 

        return res.json(chat);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

//@route  delete api/createchat
//@desc   delete  chat by id
//@access Private
router.delete(
  "/:id",
  auth,
  async (req, res) => {
    

    try {
    
      let chat = await Chat.findById(req.params.id);
      
       if (!chat)
         return res
           .status(400)
           .json({ error: [{ msg: "No chat exists with this id" }] }); 

         chat = await Chat.findByIdAndRemove(req.params.id);

        return res.json({msg:"Chat deleted"});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);


module.exports=router;
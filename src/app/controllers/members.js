const { age, date } = require('../../lib/utils')

module.exports = {

    index(req, res){
        return res.render("members/index", {members:data.members})
    },
    create(req,res){
        return res.render("members/create")
    },
    post(req,res){
        const keys = Object.keys(req.body)

        for(key of keys){
            if(req.body[key] == ""){
                return res.send('Por Favor, Preencher todos os Campos.')
            }
        }
    
        let {avatar_url, birth, name, services, gender} = req.body
    
        birth = Date.parse(birth)
        const created_at = Date.now()
        const id = Number(data.members.length + 1)
    
        data.members.push({
          id,
          avatar_url,
          name,
          birth,
          gender,
          services,
          created_at,
        })
    
        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
            if(err) return res.send("Write filer error!!")
    
            return res.redirect("/members")
        })
        
        //return res.send(req.body)        
    },
    show(req, res){
        const { id } = req.params
    
        const foundMember = data.members.find(function(member){
            return member.id == id
        })
    
        if(!foundMember) return res.send("Member Not Found!")
    
        const member = {
            ...foundMember,
            age: age(foundMember.birth), 
            services: foundMember.services.split(","),
            created_at: new Intl.DateTimeFormat("pt-BR").format(foundMember.created_at),    
        }
    
        return res.render("members/show", {member: member})
    },
    edit(req,res){
        const { id } = req.params
    
        const foundMember = data.members.find(function(member){
            return member.id == id
        })
    
        if(!foundMember) return res.send("Member Not Found!")
    
        const member = {
            ...foundMember,
            birth: date(foundMember.birth).iso
        }
    
        return res.render('members/edit', { member })
    },
    put(req,res){
        const { id } = req.body
        let index = 0
        const foundMember = data.members.find(function(member, foundIndex){
            if (member.id == id){
                index = foundIndex
                return true
            }
        })
    
        if(!foundMember) return res.send("Member Not Found!")
    
        const member = {
            ...foundMember,
            ...req.body,
            birth: Date.parse(req.body.birth),
            id: Number(req.body.id)
        }
    
        data.members[index] = member
    
        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
            if(err) return res.send("Write error!")
    
            return res.redirect(`/members/${id}`)
        })
    },
    delete(req,res){
        const { id } = req.body
    
        const filteredMembers = data.members.filter(function(member){
            return member.id != id            
        })
    
        data.members = filteredMembers
        
        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
            if(err) return res.send("Write error!")
    
            return res.redirect(`/members/`)
        })
    },

}
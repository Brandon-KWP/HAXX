const express = require("express");
const app = express();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

/* ------------------------------ */

const User = require("../models/m-auth.js");

/* ------------------------------ */

exports.getLoginPage = (req, res) => {
  res.render("auth/login");
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Initialiser la session utilisateur
    req.session.userId = user._id;
    req.session.isAuthenticated = true;
    req.session.user = {
      id: user._id,
      email: user.email,
      pseudo: user.pseudo,
      role: user.role,
    };

    res.status(200).json({
      message: "Connexion réussie",
      redirect: "/",
    });
  } catch (error) {
    console.error("Erreur connexion:", error);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};

exports.getRegisterPage = (req, res) => {
  res.render("auth/register");
};

exports.postRegister = async (req, res) => {
  try {
    const { pseudo, pseudo_ubisoft, pseudo_discord, email, password } =
      req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({
      $or: [{ email }, { pseudo_ubisoft }, { pseudo_discord }],
    });
 
    if (userExists) {
      return res.status(400).json({
        message: "Cet email ou pseudo est déjà utilisé",
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer le nouvel utilisateur
    const user = new User({
      pseudo,
      pseudo_ubisoft,
      pseudo_discord,
      email,
      password: hashedPassword,
      role: "user",
      notifications: [],
      events: [],
    });

    await user.save();

    res.status(201).json({
      message: "Inscription réussie",
      redirect: "/login",
    });
  } catch (error) {
    console.error("Erreur inscription:", error);
    res.status(500).json({
      message: "Erreur lors de l'inscription",
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Aucun compte associé à cet email" });
    }

    // Configurer le transporteur d'email avec OAuth2
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Vérifier la configuration
    await transporter.verify().catch(console.error);

    // Générer un mot de passe temporaire
    const tempPassword = crypto.randomBytes(8).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Mettre à jour le mot de passe
    user.password = hashedPassword;
    await user.save();

    // Envoyer l'email
    await transporter.sendMail({
      from: `"TEAM HAXX" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Réinitialisation de votre mot de passe - TEAM HAXX",
      html: `
                <h1>Réinitialisation de votre mot de passe</h1>
                <p>Bonjour ${user.pseudo},</p>
                <p>Voici votre nouveau mot de passe temporaire : <strong>${tempPassword}</strong></p>
                <p>Pour des raisons de sécurité, nous vous recommandons de le modifier dès votre prochaine connexion.</p>
                <p>Si vous n'êtes pas à l'origine de cette demande, veuillez sécuriser votre compte immédiatement.</p>
                <p>Cordialement,<br>L'équipe HAXX</p>
            `,
    });

    res
      .status(200)
      .json({
        message: "Un email avec votre nouveau mot de passe a été envoyé",
      });
  } catch (error) {
    console.error("Erreur réinitialisation:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la réinitialisation du mot de passe" });
  }
};

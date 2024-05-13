const { Konseling } = require("../models");
const { User } = require("../models");
const db = require("../models");
const { Psikolog } = require("../models");
const { Lapor } = require("../models");
const jwt = require("jsonwebtoken");

module.exports = {
  getAllLapor: async (req, res) => {
    const lapor = await Lapor.findAll({
      include: {
        model: db.User,
        attributes: ["id", "nama", "email"],
      },
    });
    res.json({
      message: "berhasil mendapatkan data Lapor",
      data: lapor,
    });
  },
  getLaporById: async (req, res) => {
    const { id } = req.params;
    const laporId = id;
    if (!laporId) {
      return res.status(400).json({
        message: "data not found",
      });
    }
    const lapor = await Lapor.findOne({
      where: { id: laporId },
      include: {
        model: db.User,
        attributes: ["id", "nama", "email"],
      },
    });

    res.json({
      message: "berhasil mendapatkan data id",
      data: lapor,
    });
  },
  addNewLapor: async (req, res) => {
    // const data = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const { id } = decoded;
    const { tanggal, keterangan } = req.body;
    await Lapor.create({ tanggal, keterangan, user_id: id });
    res.status(201).json({
      message: "Berhasil menambahkan Lapor",
    });
  },
  deleteLapor: async (req, res) => {
    try {
      const { id } = req.params;
      await Lapor.destroy({
        where: {
          id: id,
        },
      });
      res.json({
        message: "Data Lapor Berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({
        message: "Gagal menghapus data Lapor",
        error: error.message,
      });
    }
  },
  updateLapor: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      await Lapor.update(data, {
        where: {
          id: id,
        },
      });

      res.status(201).json({
        message: "Berhasil mengupdate data Lapor",
      });
    } catch (error) {
      res.status(500).json({
        message: "Gagal mengupdate data Lapor",
        error: error.message,
      });
    }
  },
};

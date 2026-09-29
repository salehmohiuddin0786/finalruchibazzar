const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Restaurant", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    ownerName: DataTypes.STRING,
    ownerPhone: DataTypes.STRING,
    ownerEmail: DataTypes.STRING,

    restaurantPhone: DataTypes.STRING,
    restaurantEmail: DataTypes.STRING,

    address: DataTypes.TEXT,
    landmark: DataTypes.STRING,
    pincode: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,

    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,

    logo: DataTypes.STRING,
    coverImage: DataTypes.STRING,

    fssaiNumber: DataTypes.STRING,
    fssaiDocument: DataTypes.STRING,

    gstNumber: DataTypes.STRING,
    gstDocument: DataTypes.STRING,

    panNumber: DataTypes.STRING,
    panCard: DataTypes.STRING,

    registrationCertificate: DataTypes.STRING,
    businessType: DataTypes.STRING,

    cuisines: {
      type: DataTypes.TEXT,
      get() {
        const value = this.getDataValue("cuisines");
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue("cuisines", JSON.stringify(value || []));
      },
    },

    foodType: DataTypes.STRING,
    preparationTime: DataTypes.INTEGER,
    minimumOrderValue: DataTypes.FLOAT,
    deliveryRadius: DataTypes.FLOAT,

    openingTime: DataTypes.STRING,
    closingTime: DataTypes.STRING,

    dineIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    takeaway: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    accountHolderName: DataTypes.STRING,
    bankName: DataTypes.STRING,
    accountNumber: DataTypes.STRING,
    ifscCode: DataTypes.STRING,
    upiId: DataTypes.STRING,

    cancelledCheque: DataTypes.STRING,

    outletPhotos: {
      type: DataTypes.TEXT,
      get() {
        const value = this.getDataValue("outletPhotos");
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue("outletPhotos", JSON.stringify(value || []));
      },
    },

    menuPdf: DataTypes.STRING,

    aboutRestaurant: DataTypes.TEXT,
    popularDishes: DataTypes.TEXT,
    referralCode: DataTypes.STRING,

    isPhoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    isOpen: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
};
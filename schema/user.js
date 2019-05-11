module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true,
        autoIncrement: true
      },
      //用户名
      UserName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "UserName"
      },
      //密码
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "Password"
      },
      //qxzy 密码md5
      qxzyPasswd: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "qxzyPasswd"
      },
      //11位手机号
      TelPhone: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "TelPhone"
      },
      // 6位值返回凭证
      loginCode: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "loginCode"
      },
      // 用户类型
      UserType: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "UserType"
      },
    },
    {
      /**
       * 如果为true，则表示名称和model相同，即user
       * 如果为fasle，mysql创建的表名称会是复数，即users
       * 如果指定的表名称本身就是复数，则形式不变
       */
      freezeTableName: true
    }
  );
};
